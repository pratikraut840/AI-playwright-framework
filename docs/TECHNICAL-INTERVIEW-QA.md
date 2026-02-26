# Technical Interview Q&A — AI-Playwright Framework

Simple answers for all technical interview questions based on this framework.

---

## 1. Framework Architecture & Design

### Q1: What is a hybrid test automation framework, and how does this project implement it (BDD, TDD, API)?

**Answer:** A hybrid framework combines multiple testing styles in one project. This framework has:
- **BDD:** Cucumber + Gherkin for UI tests (step definitions, feature files, OrangeHRMWorld)
- **TDD:** Pure Playwright tests for UI (page objects, fixtures, no Gherkin)
- **API:** Playwright’s APIRequestContext for REST API tests (Restful-Booker)

All three share structure but run with different configs/commands.

---

### Q2: How does BaseAPI apply Open/Closed Principle and Liskov Substitution Principle from SOLID?

**Answer:**
- **Open/Closed:** New API clients (e.g. `RestfulBookerClient`) extend `BaseAPI` without changing it. New behavior is added by subclassing.
- **Liskov:** Subclasses can replace `BaseAPI` anywhere it’s used. `RestfulBookerClient` and `RestfulBookerClientWithReport` both behave correctly as API clients.

---

### Q3: What is the RequestBuilder pattern and how does method chaining help?

**Answer:** RequestBuilder is a fluent builder for HTTP requests. You chain methods like `.path()`, `.method()`, `.body()`, `.headers()` and end with `.send()`. It avoids long parameter lists, keeps requests readable, and lets you add optional parts (headers, body) only when needed.

---

### Q4: Why is BaseAPI abstract? How would you add a new API client (e.g. PaymentsClient)?

**Answer:** `BaseAPI` is abstract because it only provides common logic (baseUrl, headers, `req()`). Concrete clients implement actual endpoints. To add `PaymentsClient`: extend `BaseAPI`, call `super(request, config)`, and add methods like `createPayment()` using `this.req().path('/payments').method('POST').body(payload).send()`.

---

### Q5: How is separation of concerns achieved between UI and API layers?

**Answer:**
- **UI:** `src/ui/` — pages, step definitions, BDD/TDD specs
- **API:** `src/api/` — clients, fixtures, specs, validators
- **Config:** Separate `playwright.config.ts` for UI and `playwright.api.config.ts` for API
- **Env:** `src/ui/helpers/env/` vs `src/api/env/`
- Shared: Allure, JUnit, reporting scripts

---

### Q6: Describe the folder structure and why it’s organized that way.

**Answer:**
- `src/api/base/` — BaseAPI
- `src/api/client/` — API clients
- `src/api/builders/` — RequestBuilder
- `src/api/specs/` — API specs
- `src/api/fixtures/` — test fixtures
- `src/api/config/` — env config
- `src/api/validators/` — schema/response validation
- `src/api/data/` — test data
- `src/api/mocks/` — mock responses
- `src/ui/pages/` — Page Objects
- `src/ui/stepDefinitions/` — Cucumber steps
- `src/ui/tdd/specs/` — TDD specs

This keeps code easy to find and maintain.

---

## 2. Playwright Fundamentals

### Q7: How does APIRequestContext differ from a browser context?

**Answer:** `APIRequestContext` makes HTTP requests without a browser. Browser context runs real pages. Use APIRequestContext for REST/API testing (faster, no browser), and browser context for UI testing.

---

### Q8: Explain Playwright fixtures and how apiFixtures inject RestfulBookerClient.

**Answer:** Fixtures prepare reusable test dependencies. `test.extend()` adds new fixtures. In `apiFixtures`, the `restfulBookerClient` fixture is created from `request` and passed to tests. Tests receive `RestfulBookerClient` via `{ restfulBookerClient }` in the test function.

---

### Q9: What is storage state and how is it used in TDD?

**Answer:** Storage state saves cookies and local storage from a logged-in session. Global setup logs in once, saves state to `admin-user.json`, and TDD specs that need auth use `storageState: STORAGE_STATE` so they start already logged in.

---

### Q10: Why split GUEST_SPECS and AUTHORIZED_SPECS into separate projects?

**Answer:** Guest specs (e.g. login) run without storage state. Authorized specs need it. Separate projects let you run each group with its own config and avoid loading storage state for tests that don’t need it.

---

### Q11: What do fullyParallel and workers control?

**Answer:** `fullyParallel` runs test files in parallel. `workers` sets how many worker processes run at once. CI often uses `workers: 1` for stability; local runs use more workers for speed.

---

### Q12: How does Playwright’s request fixture differ from page?

**Answer:** `request` is the APIRequestContext and can exist without a browser. `page` is a browser page. API specs use `request`; UI specs use `page`. Both are available where needed via config.

---

## 3. API Testing Specifics

### Q13: How does withRetry work (exponential backoff, retryable status codes)?

**Answer:** `withRetry` runs a function and retries on failures or specific status codes (429, 502, 503, 504). It uses exponential backoff: `baseDelayMs * 2^(attempt-1)`, capped at `maxDelayMs`. Default: 3 attempts, 500ms base delay, 5000ms max delay.

---

### Q14: What is ResponseValidator’s purpose and how do you use it?

**Answer:** It validates API responses with fluent methods. Example: `validateResponse(response).expectStatus(200).expectHeader('content-type', 'application/json').expectBodyProperty('token', 'string').assert()`. Call `assert()` to throw if validation fails.

---

### Q15: How does JSON schema validation work with AJV?

**Answer:** Schemas define expected structure. `validateSchema(schema, data)` uses AJV to check data. It returns `{ valid, errors }`. Use it when you need strict schema checks instead of loose `expect` assertions.

---

### Q16: What is RestfulBookerClientWithReport and how does it extend RestfulBookerClient?

**Answer:** It wraps `RestfulBookerClient` and overrides methods to attach request/response to the HTML report after each call. It keeps the original client logic but adds reporting for every API call.

---

### Q17: Why does responseWithAttach use ResponseWrapper and cache the body?

**Answer:** `APIResponse.json()` or `.text()` consume the body and can only be called once. The wrapper reads the body once, attaches it to the report, and caches it so tests can call `.json()` or `.text()` multiple times without errors.

---

### Q18: How does the LoggingInterceptor wrap API calls? When is it active?

**Answer:** `withLogging(context, fn)` wraps the API call and logs method, URL, request body, status, and duration. It runs when `API_LOG_REQUESTS=true` or `DEBUG=true`.

---

### Q19: Describe the mock strategy in MockResponseBuilder.

**Answer:** `createMockResponse(config)` returns a fake `APIResponse` with status, body, and headers. `MOCK_RESPONSES` has predefined mocks (auth success, bad credentials, booking created, etc.). Use when `API_USE_MOCK=true` or for unit tests that must not hit the real API.

---

### Q20: Why are auth and booking retried but not others?

**Answer:** These endpoints can be flaky (rate limits, timeouts). `RETRYABLE_ENDPOINTS` lists `/auth` and `/booking`. `shouldRetry()` only retries when the path matches and mocks are off.

---

## 4. BDD & Cucumber

### Q21: How does the custom Cucumber World (OrangeHRMWorld) differ from the default World?

**Answer:** OrangeHRMWorld adds `browser`, `context`, and `page` so step definitions can use them directly. Each scenario gets a new World instance with its own Playwright objects.

---

### Q22: How does BDD share Page Objects with TDD?

**Answer:** Both use the same Page Object classes (e.g. `LoginPage`) in `src/ui/pages/`. BDD step definitions create instances from `this.page` (World); TDD uses fixtures that inject Page Objects. Same logic, different wiring.

---

### Q23: What is the relationship between Gherkin steps and step definitions?

**Answer:** Gherkin (e.g. `Given user is on login page`) defines behavior. Step definitions (e.g. `Given('user is on login page', async function(...) {...})`) implement them in TypeScript. Cucumber links them by matching the text.

---

### Q24: Why separate assertions from Page Objects?

**Answer:** Page Objects should perform actions; assertions check results. Separating them keeps pages focused and lets you reuse different assertion logic for the same page across tests.

---

### Q25: How would you run only @smoke tests in BDD?

**Answer:** Run `npm run test:bdd:smoke`, which passes `--tags "@smoke"` to the Cucumber runner.

---

## 5. TDD & Page Object Model

### Q26: How do TDD fixtures inject Page Objects?

**Answer:** `test.extend()` adds fixtures like `loginPage`, `adminPage`, etc. Each fixture creates the Page Object with `page` and passes it to the test. Tests receive them via `{ loginPage, adminPage }` in the test function.

---

### Q27: Explain global setup (what it does, when it runs).

**Answer:** Global setup runs before all TDD tests. It launches a browser, logs in via `LoginPage`, waits for the dashboard, saves storage state to `admin-user.json`, and closes the browser. Authorized specs then reuse that state.

---

### Q28: Why save storage state once in global setup instead of logging in per test?

**Answer:** Logging in for every test wastes time and increases flakiness. One login, saved state, and reuse across tests is faster and more stable.

---

### Q29: How do test.beforeEach and test.afterEach in fixtures add Allure labels and failure screenshots?

**Answer:** `beforeEach` adds Allure `thread` label using `testInfo.parallelIndex`. `afterEach` checks `testInfo.status` and, on failure, saves a screenshot to `playwright-report/playwright-report-tdd/playwright-screenshots/`.

---

### Q30: Describe the Page Object design (actions vs assertions, encapsulation).

**Answer:** Page Objects expose actions (fill, click, navigate) but not assertions. Assertions live in separate modules. Pages encapsulate selectors and actions; tests combine pages and assertions.

---

## 6. Reporting & Debugging

### Q31: How does attachApiToReport get request/response into the HTML report?

**Answer:** `attachApiToReport` uses `testInfo.attach()` to add request/response data to the HTML report. `RestfulBookerClientWithReport` calls it after each API method. The report shows requests, responses, and timing.

---

### Q32: What reporters are configured for the API layer?

**Answer:** Line (console), HTML, JSON, JUnit XML, and Allure Playwright reporter. Output goes to `playwright-report/playwright-report-api` and `allure-report/results/api-raw`.

---

### Q33: How would you generate and view an Allure report after API tests?

**Answer:**
1. `npm run test:api`
2. `npm run allure:api:generate`
3. `npm run allure:api:serve`

Alternatively: `npm run allure:api:all` to generate and serve.

---

### Q34: When would you enable API_LOG_REQUESTS or DEBUG, and what gets logged?

**Answer:** Use when debugging failing API tests. The logging interceptor logs method, URL, request body, response status, and duration for each API call.

---

## 7. Environment & Configuration

### Q35: How does apiEnv.ts load configuration? What’s the fallback order?

**Answer:** It loads `.env.{NODE_ENV}` then `.env`. `getEnv(key, fallback)` reads `process.env[key] ?? fallback` and throws if neither is set for required vars. Optional vars use fallbacks.

---

### Q36: What env variables control retries, performance thresholds, mocks, and logging?

**Answer:**
- Retries: `API_RETRY_MAX_ATTEMPTS`, `API_RETRY_BASE_DELAY_MS`
- Performance: `API_RESPONSE_TIME_THRESHOLD`
- Mocks: `API_USE_MOCK`
- Logging: `API_LOG_REQUESTS`, `DEBUG`

---

### Q37: Why separate .env for UI vs API?

**Answer:** UI uses OrangeHRM (baseUrl, username, etc.); API uses Restful-Booker. Different apps need different config, so env files and load paths are split.

---

### Q38: How does playwright.config.ts differ from playwright.api.config.ts?

**Answer:** `playwright.config.ts` runs UI tests in a browser (TDD specs). `playwright.api.config.ts` runs API tests with `APIRequestContext` only, no browser. Different test dirs, timeouts, and options.

---

## 8. Test Design & Strategy

### Q39: Why use test.beforeAll for auth in booking.spec.ts instead of beforeEach?

**Answer:** The auth token is shared across many tests. `beforeAll` gets the token once. `beforeEach` would call auth for every test, which is slower and unnecessary since the token stays valid for the suite.

---

### Q40: How are @smoke and @regression tags used?

**Answer:** Tags mark test suites or scenarios. BDD: `npm run test:bdd:smoke --tags "@smoke"`. TDD: `playwright test -g "@smoke"`. API: `playwright test --config=playwright.api.config.ts -g "@smoke"`. They help run subsets of tests.

---

### Q41: What types of assertions do booking specs perform?

**Answer:** Status codes, response structure (e.g. bookingid), response body fields, performance (response time vs threshold), negative cases (404, invalid payload), headers (Content-Type), and end-to-end flows (create → get → update → delete).

---

### Q42: How would you add a new API endpoint test using TDD (RED-GREEN-REFACTOR)?

**Answer:**
1. **RED:** Write a test that calls the new endpoint and fails (e.g. 404).
2. **GREEN:** Add the endpoint to the client and minimal logic until the test passes.
3. **REFACTOR:** Move logic into base/client layers, add types, make it reusable.

---

### Q43: Explain the flow in responseWithAttach.ts (why read body once, attach, return wrapper).

**Answer:** Raw `APIResponse` body can only be consumed once. So we read it once, attach it to the report, and return a wrapper that caches the parsed body so tests can call `.json()` multiple times. The report gets full request/response data; tests keep normal usage.

---

## 9. TypeScript & Tooling

### Q44: How does the project use TypeScript for API payloads and responses?

**Answer:** Types like `CreateBookingPayload` define payload shape. `APIResponse` is typed. `await response.json()` is cast or typed (e.g. `as { token?: string }`) for assertions. This improves autocomplete and catches type errors.

---

### Q45: How would you add strict typing for a new API response?

**Answer:** Define an interface (e.g. `CreateBookingResponse { bookingid: number }`), use it where the response is parsed, and optionally validate with a JSON schema.

---

### Q46: What does `as const` do in schema and endpoint objects?

**Answer:** `as const` makes the object deeply readonly and preserves literal types. `{ auth: '/auth' } as const` keeps `auth` as `'/auth'` instead of `string`, improving type safety.

---

## 10. CI/CD & DevOps

### Q47: Why does CI use retries: 2 but local uses retries: 0?

**Answer:** CI runs are more prone to flakiness (network, shared env). Retries reduce false failures. Locally, retries can hide real bugs, so they’re disabled.

---

### Q48: How would you integrate this framework into a CI pipeline?

**Answer:** Run `npm run test:api` (or `test:bdd`, `test:tdd`) in CI. Publish artifacts (HTML, JUnit, Allure results). Use JUnit for pass/fail and Allure for rich reports. Optionally run by tags (e.g. smoke on every commit).

---

### Q49: What does forbidOnly: !!process.env.CI prevent?

**Answer:** It fails the run if any `test.only` or `describe.only` is left. Prevents accidentally committing focused tests that skip the rest of the suite.

---

### Q50: How would you run tests in parallel locally but sequentially in CI?

**Answer:** Set `workers: process.env.CI ? 1 : undefined`. Locally, multiple workers run in parallel; in CI, one worker runs tests sequentially for stability.

---

## 11. Advanced / Design Decisions

### Q51: How would you extend RequestBuilder for query params, multiple headers, and body types?

**Answer:** Add `.query(params)`, merge with URL. `.headers()` already supports multiple headers. Add `.bodyJson()`, `.bodyForm()`, `.bodyText()` and pass the right `Content-Type` and body format to the request.

---

### Q52: How would you add per-endpoint performance thresholds?

**Answer:** Add a config map (endpoint → maxMs), pass the endpoint to the validator, and compare elapsed time to the configured threshold for that endpoint.

---

### Q53: What are pros/cons of fixtures vs base classes for composing tests?

**Answer:** **Fixtures:** Flexible, Playwright-native, no inheritance. **Base classes:** Shared setup via inheritance, but can lead to deep hierarchies. This framework prefers fixtures for dependency injection.

---

### Q54: How would you structure tests for an API requiring OAuth2 instead of cookie auth?

**Answer:** Add an auth helper that gets the OAuth token (client credentials or similar) and injects it in the `Authorization` header. Use fixtures to provide the token to tests, similar to the current cookie-based auth flow.

---

### Q55: How does the framework avoid duplicate login when both BDD and TDD need auth?

**Answer:** Both use the same storage state file (`admin-user.json`). Global setup creates it once. TDD loads it via `storageState`. BDD can do a BeforeAll login or load the same file. One file, shared across both.

---

### Q56: What SOLID principle does RestfulBookerClientWithReport support?

**Answer:** **Open/Closed** — the report wrapper adds behavior without changing `RestfulBookerClient`. **Single Responsibility** — one class for API calls, another for reporting.

---

### Q57: When would you use BDD vs TDD in this project?

**Answer:** **BDD:** When stakeholders need readable scenarios and collaboration. **TDD:** When you want pure Playwright tests, faster runs, and direct code control. Both share Page Objects and assertions.

---

### Q58: How would you support multiple environments (dev, staging, prod)?

**Answer:** Use `NODE_ENV` or `TEST_ENV` with `.env.dev`, `.env.staging`, `.env.prod`. Load the right file and use different base URLs, credentials, and thresholds per env.

---

### Q59: How do the three configs (playwright.config, playwright.api.config, Cucumber) relate?

**Answer:** `playwright.config.ts` — TDD UI. `playwright.api.config.ts` — API. Cucumber — BDD UI via its own runner script. They target different test layers and are run by different commands.

---

### Q60: What is the purpose of ResponseWrapper implementing APIResponse?

**Answer:** It matches the `APIResponse` interface so callers can use `.json()`, `.ok()`, `.status()`, etc. as usual, but the body is cached so `.json()` can be called multiple times after attaching to the report.

---

## Quick Reference — Key Files

| Topic            | File(s) |
|------------------|---------|
| Base API         | `src/api/base/BaseAPI.ts` |
| Request Builder  | `src/api/builders/RequestBuilder.ts` |
| API Client       | `src/api/client/restfulBookerClient.ts` |
| Retry            | `src/api/utils/retry.ts` |
| Schema validation| `src/api/validators/SchemaValidator.ts` |
| Fixtures         | `src/api/fixtures/apiFixtures.ts`, `src/ui/tdd/fixtures/index.ts` |
| BDD World        | `src/ui/helpers/hooks/orangeHRMWorld.ts` |
| Config           | `playwright.config.ts`, `playwright.api.config.ts` |
| Env              | `src/api/config/apiEnv.ts` |
