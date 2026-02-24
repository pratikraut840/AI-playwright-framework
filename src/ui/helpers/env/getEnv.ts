/**
 * Get environment variable with optional fallback.
 * Use for base URL, credentials, and environment-specific config.
 */
export function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}
