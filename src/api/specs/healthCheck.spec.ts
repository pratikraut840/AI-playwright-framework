/**
 * Health Check / Ping API specs (Restful-Booker).
 */
import { test, expect } from '../fixtures/apiFixtures';
import { API_ENV } from '../config/apiEnv';

test.describe('Health Check / Ping API', () => {
  test('Verify ping returns 201 Created @smoke @regression', async ({ restfulBookerClient }) => {
    const response = await restfulBookerClient.ping();

    expect(response.status()).toBe(201);
  });

  test('Verify response time is within threshold @regression', async ({ restfulBookerClient }) => {
    const start = Date.now();
    const response = await restfulBookerClient.ping();
    const elapsed = Date.now() - start;

    expect(response.ok()).toBeTruthy();
    expect(elapsed).toBeLessThanOrEqual(API_ENV.responseTimeThreshold);
  });
});
