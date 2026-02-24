# API Testing Layer – Restful-Booker

## Overview

Dedicated API testing layer using Playwright + TypeScript, following TDD principles. Target: [Restful-Booker](https://restful-booker.herokuapp.com/).

## Folder Structure

```
src/api/
├── base/
│   └── BaseAPI.ts         # Abstract base for API clients (SOLID)
├── builders/
│   └── RequestBuilder.ts  # Fluent request builder pattern
├── client/
│   ├── restfulBookerClient.ts       # Extends BaseAPI, uses RequestBuilder
│   └── restfulBookerClientWithReport.ts  # Report attachments
├── config/
│   └── apiEnv.ts          # Loads from env/, perf/retry config
├── constants/
│   └── endpoints.ts       # API path constants
├── data/
│   └── restfulBooker.data.ts  # Payloads (create, update)
├── env/
│   ├── .env               # Auth creds (DO NOT commit secrets)
│   └── .env.example       # Sample env vars
├── fixtures/
│   └── apiFixtures.ts     # Playwright fixtures (restfulBookerClient)
├── interceptors/
│   └── LoggingInterceptor.ts  # Request/response logging (API_LOG_REQUESTS=true)
├── mocks/
│   └── MockResponseBuilder.ts  # Mock strategy for isolated tests (API_USE_MOCK=true)
├── specs/
│   ├── auth.spec.ts       # Auth / Create Token
│   ├── booking.spec.ts    # CRUD, Get IDs, edge cases
│   └── healthCheck.spec.ts # Ping
├── types/
│   └── restfulBooker.types.ts  # TypeScript interfaces
├── utils/
│   └── retry.ts           # Retry mechanism for flaky endpoints
└── validators/
    ├── ResponseValidator.ts    # Status, headers, body assertions
    ├── SchemaValidator.ts      # JSON schema validation (ajv)
    └── schemas/               # Auth & booking JSON schemas
        ├── auth.schema.ts
        └── booking.schema.ts
```

## APIs Covered

| API | Method | Spec |
|-----|--------|------|
| Create Token | POST /auth | auth.spec.ts |
| Get Booking IDs | GET /booking | booking.spec.ts |
| Get Booking by ID | GET /booking/:id | booking.spec.ts |
| Create Booking | POST /booking | booking.spec.ts |
| Update Booking | PUT /booking/:id | booking.spec.ts |
| Partial Update | PATCH /booking/:id | booking.spec.ts |
| Delete Booking | DELETE /booking/:id | booking.spec.ts |
| Ping | GET /ping | healthCheck.spec.ts |

## Running Tests

```bash
npm run test:api           # All API tests
npm run test:api:smoke     # Smoke subset
npm run test:api:ui        # Playwright UI mode
npm run test:api:junit     # CI mode (JUnit output)
npm run report:api         # Generate JUnit HTML + serve (blocks, opens browser)
npm run report:api:generate # Generate JUnit HTML only (exits, for CI)
npm run report:api:all     # Run test:api + report:api:generate
```

## Architecture

| Component | Purpose |
|-----------|---------|
| **BaseAPI** | Abstract base for API clients (SOLID: Open/Closed) |
| **Request Builder** | Fluent API for constructing HTTP requests |
| **Response Validator** | Composable status/header/body validations |
| **Schema Validator** | JSON schema validation via ajv |
| **Retry** | Exponential backoff for flaky endpoints (auth, booking) |
| **Logging Interceptor** | Request/response logging when `API_LOG_REQUESTS=true` |
| **Mock Builder** | Canned responses for isolated tests (`API_USE_MOCK=true`) |
| **Performance Config** | `API_RESPONSE_TIME_THRESHOLD`, `API_RETRY_*` in env |

## Environment

Copy `src/api/env/.env.example` to `src/api/env/.env` and override as needed:

```
RESTFUL_BOOKER_BASE_URL=https://restful-booker.herokuapp.com
RESTFUL_BOOKER_USERNAME=admin
RESTFUL_BOOKER_PASSWORD=password123
RESTFUL_BOOKER_INVALID_USERNAME=invalid
RESTFUL_BOOKER_INVALID_PASSWORD=wrong
API_RESPONSE_TIME_THRESHOLD=5000
API_RETRY_MAX_ATTEMPTS=3
API_RETRY_BASE_DELAY_MS=500
# API_LOG_REQUESTS=true    # Enable logging
# API_USE_MOCK=true        # Use mock responses
```

## Using Validators & Schemas

```ts
import { validateResponse, validateSchema } from '../index';
import { AUTH_TOKEN_SCHEMA } from '../validators/schemas/auth.schema';

// Response validation (status, headers, body)
const response = await client.createToken(username, password);
const v = validateResponse(response);
v.expectStatus(200).expectOk();
await v.expectBodyProperty('token', 'string');
v.assert();

// JSON schema validation (ajv)
const body = await response.json();
const { valid, errors } = validateSchema(AUTH_TOKEN_SCHEMA, body);
if (!valid) throw new Error(errors?.join(', '));
```

## Tagging

- `@smoke` – Critical path (Auth, Create, Get, Ping)
- `@regression` – Full coverage

## CI Integration

1. Run `npm run test:api:junit` in CI.
2. JUnit XML: `junit-report-api/junit.xml`
3. Artifacts: `playwright-report-api/` (HTML), `test-results-api/` (raw), `junit-report-api/` (JUnit)

## Reporting

| Type | Path |
|------|------|
| HTML | playwright-report-api/playwright-report-api.html |
| JUnit XML | junit-report-api/junit.xml |
| Allure Raw | allure-results-api-raw/ (JSON/XML; input to allure generate) |

```bash
npm run report:api           # Opens JUnit viewer (serves, blocks)
npm run report:api:generate  # Generate only (CI-friendly)
npm run allure:generate     # Unified Allure report (BDD + TDD + API)
npm run allure:api:generate  # API-only Allure report
npm run allure:api:serve     # API-only Allure (generate + serve)
npm run allure:api:all       # test:api + allure:api:serve
npm run allure:open          # Opens unified Allure (includes API if test:api was run)
```
