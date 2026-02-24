/**
 * Retry mechanism for flaky endpoints.
 * Exponential backoff with configurable max attempts.
 */
export interface RetryConfig {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  /** Status codes that trigger retry (e.g. 429, 502, 503). */
  retryableStatuses?: number[];
}

const DEFAULT_CONFIG: Required<Omit<RetryConfig, 'retryableStatuses'>> & { retryableStatuses: number[] } = {
  maxAttempts: 3,
  baseDelayMs: 500,
  maxDelayMs: 5000,
  retryableStatuses: [429, 502, 503, 504],
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Execute fn with retry. Returns response; caller can check status. */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const { maxAttempts, baseDelayMs, maxDelayMs, retryableStatuses } = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn();
      if (result && typeof result === 'object' && 'status' in result) {
        const status = (result as { status: () => number }).status();
        if (retryableStatuses.includes(status) && attempt < maxAttempts) {
          const delayMs = Math.min(baseDelayMs * Math.pow(2, attempt - 1), maxDelayMs);
          await delay(delayMs);
          continue;
        }
      }
      return result;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      if (attempt < maxAttempts) {
        const delayMs = Math.min(baseDelayMs * Math.pow(2, attempt - 1), maxDelayMs);
        await delay(delayMs);
      }
    }
  }
  throw lastError ?? new Error('Retry failed');
}
