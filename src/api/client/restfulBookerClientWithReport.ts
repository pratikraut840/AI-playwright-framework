/**
 * RestfulBookerClient wrapper that auto-attaches request/response to Playwright HTML report.
 * All API calls are automatically recorded in the report for every spec.
 */
import type { APIRequestContext, TestInfo } from '@playwright/test';
import { RestfulBookerClient } from './restfulBookerClient';
import { API_ENV } from '../config/apiEnv';
import { ENDPOINTS } from '../constants/endpoints';
import { withReportAttach } from '../helpers/responseWithAttach';
import type { CreateBookingPayload } from '../types/restfulBooker.types';

export class RestfulBookerClientWithReport extends RestfulBookerClient {
  public constructor(
    request: APIRequestContext,
    private readonly testInfo: TestInfo
  ) {
    super(request);
  }

  public override async createToken(username: string, password: string) {
    const response = await super.createToken(username, password);
    return withReportAttach(this.testInfo, response, {
      url: `${API_ENV.baseUrl}${ENDPOINTS.auth}`,
      method: 'POST',
      requestBody: { username, password: '***' },
      label: 'Create Token',
    });
  }

  public override async getBookingIds() {
    const response = await super.getBookingIds();
    return withReportAttach(this.testInfo, response, {
      url: `${API_ENV.baseUrl}${ENDPOINTS.booking}`,
      method: 'GET',
      label: 'Get Booking IDs',
    });
  }

  public override async getBookingById(id: number) {
    const response = await super.getBookingById(id);
    return withReportAttach(this.testInfo, response, {
      url: `${API_ENV.baseUrl}${ENDPOINTS.bookingById(id)}`,
      method: 'GET',
      label: `Get Booking ${id}`,
    });
  }

  public override async createBooking(payload: CreateBookingPayload) {
    const response = await super.createBooking(payload);
    return withReportAttach(this.testInfo, response, {
      url: `${API_ENV.baseUrl}${ENDPOINTS.booking}`,
      method: 'POST',
      requestBody: payload,
      label: 'Create Booking',
    });
  }

  public override async updateBooking(id: number, payload: Record<string, unknown>, token: string) {
    const response = await super.updateBooking(id, payload, token);
    return withReportAttach(this.testInfo, response, {
      url: `${API_ENV.baseUrl}${ENDPOINTS.bookingById(id)}`,
      method: 'PUT',
      requestBody: payload,
      label: `Update Booking ${id}`,
    });
  }

  public override async partialUpdateBooking(id: number, payload: Record<string, unknown>, token: string) {
    const response = await super.partialUpdateBooking(id, payload, token);
    return withReportAttach(this.testInfo, response, {
      url: `${API_ENV.baseUrl}${ENDPOINTS.bookingById(id)}`,
      method: 'PATCH',
      requestBody: payload,
      label: `Partial Update Booking ${id}`,
    });
  }

  public override async deleteBooking(id: number, token: string) {
    const response = await super.deleteBooking(id, token);
    return withReportAttach(this.testInfo, response, {
      url: `${API_ENV.baseUrl}${ENDPOINTS.bookingById(id)}`,
      method: 'DELETE',
      label: `Delete Booking ${id}`,
    });
  }

  public override async ping() {
    const response = await super.ping();
    return withReportAttach(this.testInfo, response, {
      url: `${API_ENV.baseUrl}${ENDPOINTS.ping}`,
      method: 'GET',
      label: 'Ping',
    });
  }
}
