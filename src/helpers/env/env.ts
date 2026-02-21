/**
 * Environment config (URL, credentials, API endpoints).
 * Override via .env, .env.qa, .env.stage or process.env.
 */
import { getEnv } from './getEnv';

export const env = {
  baseUrl: getEnv('ORANGEHRM_BASE_URL', 'https://opensource-demo.orangehrmlive.com'),
  username: getEnv('ORANGEHRM_USERNAME', 'Admin'),
  password: getEnv('ORANGEHRM_PASSWORD', 'admin123'),
} as const;
