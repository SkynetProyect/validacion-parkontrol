/// <reference types="node" />

import { existsSync } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';

import OpenAI from 'openai';
import { z } from 'zod';
import { CustomOpenAIClient } from '@browserbasehq/stagehand';

type OpenRouterChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type DeepEvalAssessment = {
  score: number;
  reason: string;
  success: boolean;
};

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1';
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL ?? 'poolside/laguna-m.1:free';
const DEFAULT_REFERER = process.env.OPENROUTER_REFERER ?? 'http://localhost';
const DEFAULT_TITLE = process.env.OPENROUTER_TITLE ?? 'parkontrol_web';
const DEEPEVAL_ASSESSOR = join(process.cwd(), 'tests', 'helpers', 'deepeval_assessor.py');
let requestChain = Promise.resolve();

function runOneAtATime<T>(task: () => Promise<T>): Promise<T> {
  const next = requestChain.then(task, task);
  requestChain = next.then(
    () => undefined,
    () => undefined,
  );

  return next;
}

export async function requestOpenRouterJson<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      'OPENROUTER_API_KEY is required to use the AI-assisted Playwright suite. Configure it in your environment before running tests.',
    );
  }

  return runOneAtATime(async () => {
    const client = new CustomOpenAIClient({
      modelName: DEFAULT_MODEL,
      client: new OpenAI({
        apiKey,
        baseURL: OPENROUTER_ENDPOINT,
        defaultHeaders: {
          'HTTP-Referer': DEFAULT_REFERER,
          'X-OpenRouter-Title': DEFAULT_TITLE,
        },
      }),
    });

    let candidate: T;

    try {
      const response = await client.createChatCompletion<{ data: T }>({
        options: {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ] satisfies OpenRouterChatMessage[],
          response_model: {
            name: 'ai-playwright-values',
            schema: z.record(z.string(), z.string()),
          },
          temperature: 0.2,
        },
        logger: () => undefined,
      });

      candidate = response.data;
    } catch (error) {
      throw new Error(
        `[AI][Stagehand] request failed while generating Playwright data: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    if (existsSync(DEEPEVAL_ASSESSOR) && process.env.OPENROUTER_API_KEY) {
      const pythonExecutable = getPythonExecutable();
      const assessmentProcess = spawnSync(pythonExecutable, [DEEPEVAL_ASSESSOR], {
        input: JSON.stringify({
          scenario: userPrompt,
          systemPrompt,
          candidate,
        }),
        encoding: 'utf8',
        env: process.env,
      });

      if (assessmentProcess.status === 0 && assessmentProcess.stdout) {
        try {
          const assessment = JSON.parse(assessmentProcess.stdout) as DeepEvalAssessment;

          if (!assessment.success) {
            throw new Error(
              `[AI][DeepEval] candidate rejected with score ${assessment.score.toFixed(2)}: ${assessment.reason}`,
            );
          }
        } catch (error) {
          if (error instanceof Error && error.message.startsWith('[AI][DeepEval]')) {
            throw error;
          }

          throw new Error(
            `[AI][DeepEval] could not parse evaluation output: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    }

    return candidate;
  });
}

function getPythonExecutable(): string {
  const venvPython = join(process.cwd(), '.venv', 'Scripts', 'python.exe');
  if (existsSync(venvPython)) {
    return venvPython;
  }

  return process.env.PYTHON ?? 'python';
}
