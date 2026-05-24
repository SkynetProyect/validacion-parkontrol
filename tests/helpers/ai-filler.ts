import type { Locator } from '@playwright/test';

import { requestOpenRouterJson } from './openrouter-ai';

export interface AiFieldSpec {
  key: string;
  prompt: string;
  locator: Locator;
  fallback: string;
  allowedValues?: string[];
  kind?: 'login' | 'email' | 'password' | 'text' | 'number' | 'datetime' | 'select';
  existingValues?: string[];
  invalidValue?: string;
  failureVariant?: 'empty' | 'format' | 'below-min' | 'above-max' | 'duplicate' | 'custom';
}

export interface AiFillOptions {
  intent?: 'success' | 'validation-failure' | 'edge-case';
  failureReason?: string;
  failingFields?: string[];
}

function buildSystemPrompt(options: AiFillOptions): string {
  const intentLine =
    options.intent === 'validation-failure'
      ? 'The request is for a test that must fail. Generate invalid values only for the fields listed as failing fields, and keep the other fields valid so the failure is attributable.'
      : options.intent === 'edge-case'
        ? 'The request is for an edge-case test. Generate boundary values that are realistic and close to limits.'
        : 'The request is for a success-path test. Generate values that should satisfy the form and allow submission.';

  return [
    'You generate realistic Playwright form values.',
    'Return only JSON with string values for each requested key.',
    'When the request is a failure case, keep only the listed failing fields invalid so the test fails for the intended reason.',
    'For login fields, use only existing seeded credentials supplied in the request.',
    'For non-login fields, prefer realistic but synthetic test data that matches the field type.',
    intentLine,
    options.failureReason ? `Failure reason: ${options.failureReason}.` : '',
    'Do not include markdown or explanation.',
  ].join(' ');
}

function getFallbackValue(field: AiFieldSpec): string {
  if (field.kind === 'email') {
    return `user.${Date.now().toString().slice(-6)}@e2e.test`;
  }

  if (field.kind === 'number') {
    return field.fallback || '1';
  }

  if (field.kind === 'datetime') {
    return field.fallback || '2026-05-05T09:00';
  }

  return field.fallback;
}

function shouldUseGeneratedValue(field: AiFieldSpec, candidate: string | undefined, options: AiFillOptions): boolean {
  if (!candidate) {
    return false;
  }

  const approvedValues = field.existingValues ?? field.allowedValues;
  if (approvedValues && !approvedValues.includes(candidate)) {
    return false;
  }

  if (options.intent === 'validation-failure' && options.failingFields?.includes(field.key)) {
    return false;
  }

  return true;
}

function getIntentFallbackValue(field: AiFieldSpec, options: AiFillOptions): string {
  if (options.intent !== 'validation-failure' || !options.failingFields?.includes(field.key)) {
    return getFallbackValue(field);
  }

  if (field.invalidValue !== undefined) {
    return field.invalidValue;
  }

  switch (field.failureVariant) {
    case 'empty':
      return '';
    case 'format':
      if (field.kind === 'email') {
        return 'correo-invalido-sin-arroba';
      }
      if (field.kind === 'datetime') {
        return '2026/05/05 09:00';
      }
      return 'invalid-value';
    case 'below-min':
      return '-1';
    case 'above-max':
      return '999999999999';
    case 'duplicate':
      return field.fallback;
    case 'custom':
      return getFallbackValue(field);
    default:
      break;
  }

  if (field.kind === 'email') {
    return 'correo-invalido-sin-arroba';
  }

  if (field.kind === 'password') {
    return '123';
  }

  if (field.kind === 'number') {
    return '-1';
  }

  if (field.kind === 'datetime') {
    return '2026-05-05T18:00';
  }

  return '';
}

export async function fillFieldsWithAi(
  scenario: string,
  fields: AiFieldSpec[],
  options: AiFillOptions = {},
): Promise<Record<string, string>> {
  // If this test fails before any UI assertion, check the AI helper first; it may have generated
  // invalid or unavailable data, or OpenRouter may have rejected the request.
  const userPrompt = JSON.stringify({
    scenario,
    intent: options.intent ?? 'success',
    failureReason: options.failureReason ?? null,
    failingFields: options.failingFields ?? null,
    fields: fields.map((field) => ({
      key: field.key,
      prompt: field.prompt,
      kind: field.kind ?? 'text',
      existingValues: field.existingValues ?? null,
      allowedValues: field.allowedValues ?? null,
      fallback: field.fallback,
    })),
  });

  let generated: Record<string, string> = {};

  try {
    generated = await requestOpenRouterJson<Record<string, string>>(buildSystemPrompt(options), userPrompt);
  } catch {
    generated = {};
  }

  const resolvedValues: Record<string, string> = {};

  for (const field of fields) {
    const candidate = generated[field.key];
    const value = shouldUseGeneratedValue(field, candidate, options)
      ? candidate
      : getIntentFallbackValue(field, options);

    resolvedValues[field.key] = value;
    await field.locator.fill(value);
  }

  return resolvedValues;
}
