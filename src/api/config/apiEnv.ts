/**
 * API layer environment config.
 * Loads from src/api/env/ (auth creds, base URL).
 * Override via .env or process.env.
 */
import * as path from 'path';
import * as dotenv from 'dotenv';

const ENV_NAME = process.env.NODE_ENV ?? 'dev';
dotenv.config({ path: path.resolve(process.cwd(), `src/api/env/.env.${ENV_NAME}`) });
dotenv.config({ path: path.resolve(process.cwd(), 'src/api/env/.env') });

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const API_ENV = {
  baseUrl: getEnv('RESTFUL_BOOKER_BASE_URL', 'https://restful-booker.herokuapp.com'),
  username: getEnv('RESTFUL_BOOKER_USERNAME', 'admin'),
  password: getEnv('RESTFUL_BOOKER_PASSWORD', 'password123'),
  invalidUsername: getEnv('RESTFUL_BOOKER_INVALID_USERNAME', 'invalid'),
  invalidPassword: getEnv('RESTFUL_BOOKER_INVALID_PASSWORD', 'wrong'),
  /** Max response time (ms) for performance assertions */
  responseTimeThreshold: parseInt(getEnv('API_RESPONSE_TIME_THRESHOLD', '5000'), 10),
  /** Retry: max attempts for flaky endpoints */
  retryMaxAttempts: parseInt(getEnv('API_RETRY_MAX_ATTEMPTS', '3'), 10),
  /** Retry: base delay (ms) before first retry */
  retryBaseDelayMs: parseInt(getEnv('API_RETRY_BASE_DELAY_MS', '500'), 10),
  /** Enable request/response logging (API_LOG_REQUESTS=true) */
  logRequests: process.env.API_LOG_REQUESTS === 'true',
  /** Use mock server for isolated tests (API_USE_MOCK=true) */
  useMock: process.env.API_USE_MOCK === 'true',
} as const;
