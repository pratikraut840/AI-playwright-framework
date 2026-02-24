/**
 * Restful-Booker API client — extends BaseAPI, uses Request Builder.
 * Reusable client for all booking and auth APIs.
 */
import type { APIRequestContext } from '@playwright/test';
import { BaseAPI } from '../base/BaseAPI';
import { ENDPOINTS } from '../constants/endpoints';
import { API_ENV } from '../config/apiEnv';
import { withRetry } from '../utils/retry';
import { withLogging } from '../interceptors/LoggingInterceptor';
import type { CreateBookingPayload } from '../types/restfulBooker.types';

/** Endpoints that may be flaky — use retry. */
const RETRYABLE_ENDPOINTS = ['/auth', '/booking'];

export class RestfulBookerClient extends BaseAPI {
  constructor(request: APIRequestContext) {
    super(request, {
      baseUrl: API_ENV.baseUrl,
      defaultHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  private shouldRetry(path: string): boolean {
    return RETRYABLE_ENDPOINTS.some((e) => path.startsWith(e)) && !API_ENV.useMock;
  }

  async createToken(username: string, password: string) {
    const url = `${API_ENV.baseUrl}${ENDPOINTS.auth}`;
    return withLogging(
      { method: 'POST', url, requestBody: { username, password: '***' }, label: 'Create Token' },
      () =>
        withRetry(
          () =>
            this.req()
              .path(ENDPOINTS.auth)
              .method('POST')
              .body({ username, password })
              .send(),
          this.shouldRetry(ENDPOINTS.auth) ? {} : { maxAttempts: 1 }
        )
    );
  }

  async getBookingIds() {
    const url = `${API_ENV.baseUrl}${ENDPOINTS.booking}`;
    return withLogging(
      { method: 'GET', url, label: 'Get Booking IDs' },
      () =>
        this.req()
          .path(ENDPOINTS.booking)
          .method('GET')
          .headers({ Accept: 'application/json' })
          .send()
    );
  }

  async getBookingById(id: number) {
    const path = ENDPOINTS.bookingById(id);
    const url = `${API_ENV.baseUrl}${path}`;
    return withLogging(
      { method: 'GET', url, label: `Get Booking ${id}` },
      () =>
        this.req()
          .path(path)
          .method('GET')
          .headers({ Accept: 'application/json' })
          .send()
    );
  }

  async createBooking(payload: CreateBookingPayload) {
    const path = ENDPOINTS.booking;
    const url = `${API_ENV.baseUrl}${path}`;
    return withLogging(
      { method: 'POST', url, requestBody: payload, label: 'Create Booking' },
      () =>
        withRetry(
          () =>
            this.req()
              .path(path)
              .method('POST')
              .body(payload)
              .send(),
          this.shouldRetry(path) ? {} : { maxAttempts: 1 }
        )
    );
  }

  async updateBooking(id: number, payload: Record<string, unknown>, token: string) {
    return this.req()
      .path(ENDPOINTS.bookingById(id))
      .method('PUT')
      .body(payload)
      .headers({ Cookie: `token=${token}` })
      .send();
  }

  async partialUpdateBooking(id: number, payload: Record<string, unknown>, token: string) {
    return this.req()
      .path(ENDPOINTS.bookingById(id))
      .method('PATCH')
      .body(payload)
      .headers({ Cookie: `token=${token}` })
      .send();
  }

  async deleteBooking(id: number, token: string) {
    return this.req()
      .path(ENDPOINTS.bookingById(id))
      .method('DELETE')
      .headers({ Accept: 'application/json', Cookie: `token=${token}` })
      .send();
  }

  async ping() {
    const path = ENDPOINTS.ping;
    const url = `${API_ENV.baseUrl}${path}`;
    return withLogging(
      { method: 'GET', url, label: 'Ping' },
      () =>
        this.req()
          .path(path)
          .method('GET')
          .headers({ Accept: 'application/json' })
          .send()
    );
  }
}
