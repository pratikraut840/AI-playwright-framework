/**
 * API layer Playwright fixtures.
 * Provides request context and RestfulBookerClient with auto-report attachments.
 */
import { test as base } from '@playwright/test';
import { RestfulBookerClientWithReport } from '../client/restfulBookerClientWithReport';

export const test = base.extend<{
  restfulBookerClient: RestfulBookerClientWithReport;
}>({
  restfulBookerClient: async ({ request }, use, testInfo) => {
    await use(new RestfulBookerClientWithReport(request, testInfo));
  },
});

export { expect } from '@playwright/test';
