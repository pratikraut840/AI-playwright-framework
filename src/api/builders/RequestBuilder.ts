/**
 * Request Builder — Fluent API for constructing HTTP requests.
 * Supports method chaining for headers, body, retry options.
 */
import type { APIRequestContext } from '@playwright/test';

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  data?: unknown;
  timeout?: number;
  /** Skip retry for this request. */
  skipRetry?: boolean;
}

export class RequestBuilder {
  private opts: Partial<RequestOptions> = {};
  private _path = '';
  private baseUrl = '';
  private defaultHeaders: Record<string, string> = {};

  public constructor(
    private readonly request: APIRequestContext,
    baseUrl: string,
    defaultHeaders: Record<string, string>
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.defaultHeaders = defaultHeaders;
  }

  public path(p: string): this {
    this._path = p.startsWith('/') ? p : `/${p}`;
    return this;
  }

  public method(method: RequestOptions['method']): this {
    this.opts.method = method;
    return this;
  }

  public headers(headers: Record<string, string>): this {
    this.opts.headers = { ...this.opts.headers, ...headers };
    return this;
  }

  public body(data: unknown): this {
    this.opts.data = data;
    return this;
  }

  public timeout(ms: number): this {
    this.opts.timeout = ms;
    return this;
  }

  public skipRetry(): this {
    this.opts.skipRetry = true;
    return this;
  }

  private mergeHeaders(): Record<string, string> {
    return { ...this.defaultHeaders, ...this.opts.headers };
  }

  /** Execute the built request. */
  public async send() {
    const url = `${this.baseUrl}${this._path}`;
    const headers = this.mergeHeaders();
    const method = this.opts.method ?? 'GET';

    switch (method) {
      case 'GET':
        return this.request.get(url, { headers, timeout: this.opts.timeout });
      case 'POST':
        return this.request.post(url, { data: this.opts.data, headers, timeout: this.opts.timeout });
      case 'PUT':
        return this.request.put(url, { data: this.opts.data, headers, timeout: this.opts.timeout });
      case 'PATCH':
        return this.request.patch(url, { data: this.opts.data, headers, timeout: this.opts.timeout });
      case 'DELETE':
        return this.request.delete(url, { headers, timeout: this.opts.timeout });
      default:
        return this.request.get(url, { headers, timeout: this.opts.timeout });
    }
  }
}
