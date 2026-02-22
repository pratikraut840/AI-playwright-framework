/**
 * Environment config (URL, credentials, API endpoints).
 * Override via .env, .env.qa, .env.stage or process.env.
 */
import { getEnv } from './getEnv';

export const ENV = {
  baseUrl: getEnv('ORANGEHRM_BASE_URL', 'https://opensource-demo.orangehrmlive.com'),
  username: getEnv('ORANGEHRM_USERNAME', 'Admin'),
  password: getEnv('ORANGEHRM_PASSWORD', 'admin123'),
  /** Account whose password contains special characters — configure via env for Scenario 11 */
  specialCharsUsername: getEnv('ORANGEHRM_SPECIAL_CHARS_USERNAME', 'Admin'),
  specialCharsPassword: getEnv('ORANGEHRM_SPECIAL_CHARS_PASSWORD', 'admin123'),
} as const;
