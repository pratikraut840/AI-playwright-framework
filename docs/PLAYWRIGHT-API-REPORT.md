# Playwright API Report — Making It Impressive

The `playwright-report/playwright-report-api` HTML report can show rich request/response details. Here’s how to configure and use it.

---

## 1. Automatic Attachments (All Specs)

Every API call through `restfulBookerClient` is **automatically attached** to the HTML report for all specs (auth, booking, healthCheck). The fixture uses `RestfulBookerClientWithReport`, which wraps all API methods and attaches every request/response.

---

## 2. Report Configuration

In `playwright.api.config.ts`, the HTML reporter uses:

- **title**: `Restful-Booker API — Test Report`
- **outputFolder**: `playwright-report/playwright-report-api`
- **open**: `never` — does not auto-open after run

---

## 3. Manual Attachments (Optional)

For custom or extra attachments, use `attachApiToReport()` from `src/api/helpers/reportAttach.ts`:

```ts
import { attachApiToReport } from '../helpers/reportAttach';

test('custom scenario', async ({ restfulBookerClient }, testInfo) => {
  const response = await restfulBookerClient.someMethod();
  const body = await response.json();
  await attachApiToReport(testInfo, response, {
    url: '...',
    method: 'POST',
    requestBody: payload,
    responseBodyParsed: body,
    label: 'Custom Label',
  });
});
```

---

## 5. Allure Report (Alternative)

For advanced reports (environment, executor, categories, trends), use Allure:

```bash
npm run test:api
npm run allure:api:generate
npm run allure:api:serve
```

See `docs/ALLURE-REPORT.md` for configuration and usage.
