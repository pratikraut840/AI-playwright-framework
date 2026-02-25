/**
 * BaseAPI — Abstract base for API clients (SOLID: Open/Closed, Liskov).
 * Centralizes common HTTP logic, base URL, and default headers.
 */
import type { APIRequestContext } from '@playwright/test';
import { RequestBuilder } from '../builders/RequestBuilder';

export interface BaseAPIConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
}

export abstract class BaseAPI {
  protected readonly baseUrl: string;
  protected readonly request: APIRequestContext;
  protected readonly defaultHeaders: Record<string, string>;

  public constructor(request: APIRequestContext, config: BaseAPIConfig) {
    this.request = request;
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.defaultHeaders = config.defaultHeaders ?? {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  /** Build request with fluent API. */
  protected req(): RequestBuilder {
    return new RequestBuilder(this.request, this.baseUrl, this.defaultHeaders);
  }

  /** Full URL for path. */
  protected url(path: string): string {
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${p}`;
  }
}
