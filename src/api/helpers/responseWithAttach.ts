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
  public constructor(
    private readonly raw: APIResponse,
    private readonly cachedJson: unknown,
    private readonly cachedText: string
  ) {}

  public ok(): boolean {
    return this.raw.ok();
  }

  public status(): number {
    return this.raw.status();
  }

  public statusText(): string {
    return this.raw.statusText();
  }

  public url(): string {
    return this.raw.url();
  }

  public headers(): Record<string, string> {
    return this.raw.headers();
  }

  public async body(): Promise<Buffer> {
    return Buffer.from(this.cachedText || (typeof this.cachedJson === 'string' ? this.cachedJson : JSON.stringify(this.cachedJson)));
  }

  public async text(): Promise<string> {
    return this.cachedText || (this.cachedJson !== null ? JSON.stringify(this.cachedJson) : '');
  }

  public async json(): Promise<unknown> {
    return this.cachedJson;
  }

  public headerValue(name: string): string | null {
    return this.raw.headers()[name.toLowerCase()] ?? null;
  }

  public headerValues(name: string): string[] {
    const v = this.headerValue(name);
    return v ? [v] : [];
  }

  public headersArray(): Array<{ name: string; value: string }> {
    return Object.entries(this.raw.headers()).map(([name, value]) => ({ name, value }));
  }

  public async dispose(): Promise<void> {
    if ('dispose' in this.raw && typeof this.raw.dispose === 'function') {
      await (this.raw as { dispose: () => Promise<void> }).dispose();
    }
  }

  public [Symbol.asyncDispose](): Promise<void> {
    return this.dispose();
  }
}
