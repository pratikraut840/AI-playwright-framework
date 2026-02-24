/**
 * Booking Management API — CRUD operations (Restful-Booker).
 */
import { test, expect } from '../fixtures/apiFixtures';
import { API_ENV } from '../config/apiEnv';
import {
  CREATE_BOOKING_PAYLOAD,
  UPDATE_BOOKING_PAYLOAD,
  PARTIAL_UPDATE_PAYLOAD,
  INVALID_BOOKING_PAYLOAD,
} from '../data/restfulBooker.data';

test.describe('Booking Management · CRUD', () => {
  let authToken: string;
  let createdBookingId: number;

  test.beforeAll(async ({ request }) => {
    const authResponse = await request.post(`${API_ENV.baseUrl}/auth`, {
      data: { username: API_ENV.username, password: API_ENV.password },
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    });
    const authBody = (await authResponse.json()) as { token?: string };
    authToken = authBody.token ?? '';
  });

  test.describe('List Bookings', () => {
    test('Verify list of booking IDs is returned with valid structure @smoke @regression', async ({ restfulBookerClient }) => {
      const response = await restfulBookerClient.getBookingIds();

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(Array.isArray(body)).toBeTruthy();
      if (body.length > 0) {
        expect(body[0]).toHaveProperty('bookingid');
      }
    });

    test('Verify response completes within performance threshold @regression', async ({ restfulBookerClient }) => {
      const start = Date.now();
      const response = await restfulBookerClient.getBookingIds();
      const elapsed = Date.now() - start;

      expect(response.ok()).toBeTruthy();
      expect(elapsed).toBeLessThanOrEqual(API_ENV.responseTimeThreshold);
    });
  });

  test.describe('Create Booking', () => {
    test('Verify booking is created and booking ID is returned @smoke @regression', async ({ restfulBookerClient }) => {
      const response = await restfulBookerClient.createBooking(CREATE_BOOKING_PAYLOAD);

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty('bookingid');
      expect(typeof body.bookingid).toBe('number');

      createdBookingId = body.bookingid;
    });

    test('Verify newly created booking is retrievable with correct data @smoke @regression', async ({ restfulBookerClient }) => {
      const createResponse = await restfulBookerClient.createBooking(CREATE_BOOKING_PAYLOAD);
      const createBody = await createResponse.json();
      const id = createBody.bookingid;

      const getResponse = await restfulBookerClient.getBookingById(id);
      expect(getResponse.ok()).toBeTruthy();
      expect(getResponse.status()).toBe(200);

      const getBody = await getResponse.json();
      expect(getBody.firstname).toBe(CREATE_BOOKING_PAYLOAD.firstname);
      expect(getBody.lastname).toBe(CREATE_BOOKING_PAYLOAD.lastname);
      expect(getBody.totalprice).toBe(CREATE_BOOKING_PAYLOAD.totalprice);
    });
  });

  test.describe('Retrieve Booking by ID', () => {
    test.beforeEach(async ({ restfulBookerClient }) => {
      const createResponse = await restfulBookerClient.createBooking(CREATE_BOOKING_PAYLOAD);
      const body = await createResponse.json();
      createdBookingId = body.bookingid;
    });

    test('Verify complete booking details are returned for given ID @smoke @regression', async ({ restfulBookerClient }) => {
      const response = await restfulBookerClient.getBookingById(createdBookingId);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.firstname).toBe(CREATE_BOOKING_PAYLOAD.firstname);
      expect(body.lastname).toBe(CREATE_BOOKING_PAYLOAD.lastname);
    });

    test('Verify 404 Not Found is returned for non-existent booking ID @regression', async ({ restfulBookerClient }) => {
      const response = await restfulBookerClient.getBookingById(999999999);

      expect(response.status()).toBe(404);
    });
  });

  test.describe('Full Update · PUT', () => {
    test.beforeEach(async ({ restfulBookerClient }) => {
      const createResponse = await restfulBookerClient.createBooking(CREATE_BOOKING_PAYLOAD);
      const body = await createResponse.json();
      createdBookingId = body.bookingid;
    });

    test('Verify booking is replaced with valid auth token @regression', async ({ restfulBookerClient }) => {
      const response = await restfulBookerClient.updateBooking(
        createdBookingId,
        UPDATE_BOOKING_PAYLOAD,
        authToken
      );

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const getResponse = await restfulBookerClient.getBookingById(createdBookingId);
      const getBody = await getResponse.json();
      expect(getBody.firstname).toBe(UPDATE_BOOKING_PAYLOAD.firstname);
      expect(getBody.lastname).toBe(UPDATE_BOOKING_PAYLOAD.lastname);
    });
  });

  test.describe('Partial Update · PATCH', () => {
    test.beforeEach(async ({ restfulBookerClient }) => {
      const createResponse = await restfulBookerClient.createBooking(CREATE_BOOKING_PAYLOAD);
      const body = await createResponse.json();
      createdBookingId = body.bookingid;
    });

    test('Verify partial update is applied with valid auth token @regression', async ({ restfulBookerClient }) => {
      const response = await restfulBookerClient.partialUpdateBooking(
        createdBookingId,
        PARTIAL_UPDATE_PAYLOAD,
        authToken
      );

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const getResponse = await restfulBookerClient.getBookingById(createdBookingId);
      const getBody = await getResponse.json();
      expect(getBody.firstname).toBe(PARTIAL_UPDATE_PAYLOAD.firstname);
      expect(getBody.additionalneeds).toBe(PARTIAL_UPDATE_PAYLOAD.additionalneeds);
    });
  });

  test.describe('Remove Booking', () => {
    test.beforeEach(async ({ restfulBookerClient }) => {
      const createResponse = await restfulBookerClient.createBooking(CREATE_BOOKING_PAYLOAD);
      const body = await createResponse.json();
      createdBookingId = body.bookingid;
    });

    test('Verify booking is removed with valid auth token @regression', async ({ restfulBookerClient }) => {
      const response = await restfulBookerClient.deleteBooking(createdBookingId, authToken);

      expect(response.status()).toBe(201);

      const getResponse = await restfulBookerClient.getBookingById(createdBookingId);
      expect(getResponse.status()).toBe(404);
    });
  });

  test.describe('Negative · Invalid Payload', () => {
    test('Verify create request with invalid payload is rejected and returns error @regression', async ({ restfulBookerClient }) => {
      const response = await restfulBookerClient.createBooking(
        INVALID_BOOKING_PAYLOAD as Parameters<typeof restfulBookerClient.createBooking>[0]
      );

      expect(response.ok()).toBeFalsy();
      expect([400, 500]).toContain(response.status());
    });
  });
});
