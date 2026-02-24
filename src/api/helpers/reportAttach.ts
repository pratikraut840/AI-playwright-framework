/**
 * Attaches API request/response data to Playwright HTML report for rich, impressive reports.
 * Call after API calls to show request URL, method, body, response status, and response body.
 */
import type { APIResponse } from '@playwright/test';
import type { TestInfo } from '@playwright/test';

type AttachOptions = {
  /** Request URL (e.g. https://api.example.com/auth) */
  url?: string;
  /** HTTP method (GET, POST, PUT, PATCH, DELETE) */
  method?: string;
  /** Request body (object or string) - will be JSON stringified if object */
  requestBody?: unknown;
  /** Parsed response body – pass if you already called response.json() (consumes body) */
  responseBodyParsed?: unknown;
  /** Optional label for the API call (e.g. "Create Token", "Get Booking") */
  label?: string;
};

/**
 * Attach API response to the Playwright HTML report.
 * Shows in the report: Request URL, Method, Status, Request/Response bodies.
 * Pass responseBodyParsed when you have already parsed the response (e.g. with response.json()).
 */
export async function attachApiToReport(
  testInfo: TestInfo,
  response: APIResponse,
  options: AttachOptions = {}
): Promise<void> {
  const { url, method, requestBody, responseBodyParsed, label } = options;
  const prefix = label ? `[${label}] ` : '';

  const status = response.status();
  const statusText = response.statusText();
  const headers = response.headers();
  const contentType = headers['content-type'] ?? 'application/json';

  let responseBody: string;
  if (responseBodyParsed !== undefined) {
    responseBody = typeof responseBodyParsed === 'string'
      ? responseBodyParsed
      : JSON.stringify(responseBodyParsed, null, 2);
  } else {
    try {
      const json = await response.json().catch(() => null);
      responseBody = json !== null ? JSON.stringify(json, null, 2) : '(non-JSON or empty)';
    } catch {
      responseBody = '(could not parse response)';
    }
  }

  const reportSections: Array<{ name: string; body: string; contentType: string }> = [];

  // Summary block
  const summary = [
    `Status: ${status} ${statusText}`,
    method && `Method: ${method}`,
    url && `URL: ${url}`,
    `Content-Type: ${contentType}`,
  ].filter(Boolean).join('\n');
  reportSections.push({ name: `${prefix}Summary`, body: summary, contentType: 'text/plain' });

  if (requestBody !== undefined) {
    const reqStr = typeof requestBody === 'string'
      ? requestBody
      : JSON.stringify(requestBody, null, 2);
    reportSections.push({
      name: `${prefix}Request Body`,
      body: reqStr,
      contentType: 'application/json',
    });
  }

  reportSections.push({
    name: `${prefix}Response Body`,
    body: responseBody,
    contentType: 'application/json',
  });

  for (const { name, body, contentType } of reportSections) {
    await testInfo.attach(name, { body, contentType });
  }
}
