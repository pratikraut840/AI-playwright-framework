/**
 * Playwright config for API testing layer (Restful-Booker).
 * No browser – uses APIRequestContext only.
 */
import * as path from 'path';
import * as dotenv from 'dotenv';

const ENV_NAME = process.env.NODE_ENV ?? 'dev';
dotenv.config({ path: path.resolve(__dirname, `src/api/env/.env.${ENV_NAME}`) });
dotenv.config({ path: path.resolve(__dirname, 'src/api/env/.env') });

import { defineConfig } from '@playwright/test';
import { API_ENV } from './src/api/config/apiEnv';

/** Parallel: full when local, sequential when CI for stability. */
const workers = process.env.CI ? 1 : undefined;

export default defineConfig({
  testDir: './src/api/specs',
  outputDir: 'test-results/test-results-api',
  timeout: 30_000,
  fullyParallel: !process.env.CI,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers,

  reporter: [
    ['html', {outputFolder: 'playwright-report/playwright-report-api'}],
    ['json', { outputFile: 'playwright-report/playwright-report-api/results.json' }],
    ['junit', { outputFile: 'test-results/test-results-api/junit-report-api/junit.xml' }],
    ['allure-playwright', { resultsDir: 'allure-report/results/api-raw' }],
  ],

  use: {
    baseURL: API_ENV.baseUrl,
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },

  projects: [
    {
      name: 'api',
      testMatch: /\.spec\.ts$/,
    },
  ],
});
