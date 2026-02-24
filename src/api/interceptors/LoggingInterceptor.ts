/**
 * Logging interceptor — logs request/response for debugging.
 * Can be toggled via API_LOG_REQUESTS env.
 */
import type { APIResponse } from '@playwright/test';

const ENABLED = process.env.API_LOG_REQUESTS === 'true' || process.env.DEBUG === 'true';

export interface LogContext {
  method: string;
  url: string;
  requestBody?: unknown;
  label?: string;
}

/** Wrap fetch-like logic with logging. */
export async function withLogging<T>(
  context: LogContext,
  fn: () => Promise<T>
): Promise<T> {
  if (!ENABLED) {
    return fn();
  }
  const start = Date.now();
  const reqLog = `[API] ${context.method} ${context.url}`;
  console.log(reqLog);
  if (context.requestBody) {
    console.log('[API] Request body:', JSON.stringify(context.requestBody, null, 2));
  }
  try {
    const result = await fn();
    const elapsed = Date.now() - start;
    if (result && typeof result === 'object' && 'status' in result) {
      const status = (result as { status: () => number }).status();
      console.log(`[API] ${context.method} ${context.url} -> ${status} (${elapsed}ms)`);
    }
    return result;
  } catch (e) {
    const elapsed = Date.now() - start;
    console.error(`[API] ${context.method} ${context.url} -> ERROR (${elapsed}ms)`, e);
    throw e;
  }
}

/** Log response body (call after response is consumed). */
export function logResponse(context: LogContext, response: APIResponse, body: unknown): void {
  if (!ENABLED) return;
  console.log(`[API] Response body for ${context.label ?? context.url}:`, body);
}
