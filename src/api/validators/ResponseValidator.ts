/**
 * Response Validator — Validates status, headers, body structure.
 * Composable assertions for API responses.
 */
import type { APIResponse } from '@playwright/test';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class ResponseValidator {
  private errors: string[] = [];

  public constructor(private readonly response: APIResponse) {}

  /** Expect specific status code(s). */
  public expectStatus(...codes: number[]): this {
    const status = this.response.status();
    if (!codes.includes(status)) {
      this.errors.push(`Expected status ${codes.join(' or ')}, got ${status}`);
    }
    return this;
  }

  /** Expect response to be OK (2xx). */
  public expectOk(): this {
    if (!this.response.ok()) {
      this.errors.push(`Expected ok response, got ${this.response.status()}`);
    }
    return this;
  }

  /** Expect header to contain value. */
  public expectHeader(name: string, expected: string | RegExp): this {
    const value = this.response.headers()[name.toLowerCase()] ?? '';
    if (typeof expected === 'string' && !value.includes(expected)) {
      this.errors.push(`Expected header ${name} to contain "${expected}", got "${value}"`);
    } else if (expected instanceof RegExp && !expected.test(value)) {
      this.errors.push(`Expected header ${name} to match ${expected}, got "${value}"`);
    }
    return this;
  }

  /** Expect body to have property. */
  public async expectBodyProperty(key: string, type?: 'string' | 'number' | 'object' | 'boolean'): Promise<this> {
    const body = (await this.response.json().catch(() => ({}))) as Record<string, unknown>;
    if (!(key in body)) {
      this.errors.push(`Expected body to have property "${key}"`);
      return this;
    }
    if (type) {
      const t = typeof body[key];
      if (t !== type) {
        this.errors.push(`Expected body.${key} to be ${type}, got ${t}`);
      }
    }
    return this;
  }

  /** Validate and return result. */
  public validate(): ValidationResult {
    return {
      valid: this.errors.length === 0,
      errors: [...this.errors],
    };
  }

  /** Throw if validation failed. */
  public assert(): void {
    const result = this.validate();
    if (!result.valid) {
      throw new Error(`Response validation failed:\n${result.errors.join('\n')}`);
    }
  }
}

/** Create validator for response. */
export function validateResponse(response: APIResponse): ResponseValidator {
  return new ResponseValidator(response);
}
