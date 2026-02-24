/**
 * Mock strategy for isolated testing — returns canned responses without hitting real API.
 * Use when API_USE_MOCK=true or for unit testing API logic.
 */
import type { APIResponse } from '@playwright/test';

/** Minimal APIResponse-like object for mocking. */
export interface MockResponseConfig {
  status: number;
  body?: unknown;
  headers?: Record<string, string>;
}

/** Create a minimal mock APIResponse. */
export function createMockResponse(config: MockResponseConfig): APIResponse {
  const body = config.body ?? {};
  const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    ...config.headers,
  };

  return {
    ok: () => config.status >= 200 && config.status < 300,
    status: () => config.status,
    statusText: () => '',
    url: () => '',
    headers: () => headers,
    body: () => Promise.resolve(Buffer.from(bodyStr)),
    text: () => Promise.resolve(bodyStr),
    json: () => Promise.resolve(body),
    headerValue: () => Promise.resolve(null),
    headerValues: () => Promise.resolve([]),
    headersArray: () => Promise.resolve([]),
  } as unknown as APIResponse;
}

/** Predefined mock responses for Restful-Booker. */
export const MOCK_RESPONSES = {
  auth: {
    success: () =>
      createMockResponse({
        status: 200,
        body: { token: 'mock-token-12345' },
      }),
    badCredentials: () =>
      createMockResponse({
        status: 200,
        body: { reason: 'Bad credentials' },
      }),
  },
  booking: {
    created: (id: number) =>
      createMockResponse({
        status: 200,
        body: { bookingid: id },
      }),
    notFound: () =>
      createMockResponse({
        status: 404,
        body: 'Not Found',
      }),
    list: (ids: number[] = [1, 2, 3]) =>
      createMockResponse({
        status: 200,
        body: ids.map((bookingid) => ({ bookingid })),
      }),
  },
  ping: {
    ok: () =>
      createMockResponse({
        status: 201,
        body: 'Created',
      }),
  },
} as const;
