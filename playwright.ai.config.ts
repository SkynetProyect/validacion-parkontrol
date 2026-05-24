import baseConfig from './playwright.config';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  ...baseConfig,
  testMatch: ['tests/ai/**/*.spec.ts'],
});
