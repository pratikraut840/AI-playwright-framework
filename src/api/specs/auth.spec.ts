/**
 * Authentication API — Token creation (Restful-Booker).
 */
import { test, expect } from '../fixtures/apiFixtures';
import { API_ENV } from '../config/apiEnv';

test.describe('Authentication · Token Creation', () => {
  test('Verify bearer token is issued for valid credentials @smoke @regression', async ({ restfulBookerClient }) => {
    const response = await restfulBookerClient.createToken(
      API_ENV.username,
      API_ENV.password
    );

    const body = await response.json().catch(() => ({}));
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);

    const elapsed = response.headers()['x-response-time']
      ? parseInt(String(response.headers()['x-response-time']), 10)
      : null;
    if (elapsed !== null) {
      expect(elapsed).toBeLessThanOrEqual(API_ENV.responseTimeThreshold);
    }
  });

  test('Verify response returns 200 OK with non-empty token @regression', async ({ restfulBookerClient }) => {
    const response = await restfulBookerClient.createToken(API_ENV.username, API_ENV.password);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.token).toBeDefined();
    expect(String(body.token)).not.toBe('');
  });

  test('Verify Bad credentials reason is returned when credentials are invalid @regression', async ({ restfulBookerClient }) => {
    const response = await restfulBookerClient.createToken(
      API_ENV.invalidUsername,
      API_ENV.invalidPassword
    );

    const body = (await response.json()) as { token?: string; reason?: string };

    expect(response.status()).toBe(200);
    expect(body.reason).toBe('Bad credentials');
    expect(body.token).toBeUndefined();
  });

  test('Verify response contains application/json Content-Type header @regression', async ({ restfulBookerClient }) => {
    const response = await restfulBookerClient.createToken(
      API_ENV.username,
      API_ENV.password
    );

    const contentType = response.headers()['content-type'] ?? '';
    expect(contentType).toContainEqual('application/json'); //intentionally failing test
  });
});
