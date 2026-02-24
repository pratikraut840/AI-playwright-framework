/**
 * Wraps APIResponse to allow attaching to report without consuming the body for the test.
 * Reads body once, attaches to report, caches for .json() / .text() call.
 */
import type { APIResponse } from '@playwright/test';
import type { TestInfo } from '@playwright/test';
import { attachApiToReport } from './reportAttach';

type AttachOpts = {
  url: string;
  method: string;
  requestBody?: unknown;
  label?: string;
};

/**
 * Wraps the response: reads body once, attaches to report, returns wrapper with cached body.
 */
export async function withReportAttach(
  testInfo: TestInfo,
  response: APIResponse,
  opts: AttachOpts
): Promise<APIResponse> {
  let bodyText: string;
  let bodyParsed: unknown;
  try {
    bodyText = await response.text();
    bodyParsed = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    bodyText = '';
    bodyParsed = null;
  }

  await attachApiToReport(testInfo, response, {
    ...opts,
    responseBodyParsed: bodyParsed !== null ? bodyParsed : (bodyText || '(empty)'),
  });

  return new ResponseWrapper(response, bodyParsed, bodyText);
}

class ResponseWrapper implements APIResponse {
  constructor(
    private readonly raw: APIResponse,
    private readonly cachedJson: unknown,
    private readonly cachedText: string
  ) {}

  ok(): boolean {
    return this.raw.ok();
  }

  status(): number {
    return this.raw.status();
  }

  statusText(): string {
    return this.raw.statusText();
  }

  url(): string {
    return this.raw.url();
  }

  headers(): Record<string, string> {
    return this.raw.headers();
  }

  async body(): Promise<Buffer> {
    return Buffer.from(this.cachedText || (typeof this.cachedJson === 'string' ? this.cachedJson : JSON.stringify(this.cachedJson)));
  }

  async text(): Promise<string> {
    return this.cachedText || (this.cachedJson !== null ? JSON.stringify(this.cachedJson) : '');
  }

  async json(): Promise<unknown> {
    return this.cachedJson;
  }

  async headerValue(name: string): Promise<string | null> {
    return this.raw.headerValue(name);
  }

  async headerValues(name: string): Promise<string[]> {
    return this.raw.headerValues(name);
  }

  async headersArray(): Promise<Array<{ name: string; value: string }>> {
    return this.raw.headersArray();
  }
}
