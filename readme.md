# AI Playwright Hybrid Automation Framework

[![Node](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.58+-blue.svg)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

> **Enterprise-grade test automation** — BDD (Cucumber) + TDD (Playwright UI) + dedicated API layer. Built for **OrangeHRM** (UI) and **Restful-Booker** (API) with full type safety, SOLID architecture, and CI-ready reporting.

---

## ✨ Highlights

| | |
|---|---|
| **🎯 Hybrid Layers** | BDD (Gherkin), TDD (specs), API — each with its own config, fixtures, and reports |
| **🏗️ SOLID Design** | `BaseAPI` base class, fluent `RequestBuilder`, schema validation, custom interceptors |
| **📊 Rich Reporting** | Allure, Cucumber HTML, JUnit XML, xunit-viewer, Playwright HTML — unified dashboards |
| **🌍 Multi-Environment** | `.env` per dev / qa / stage with centralized `getEnv()` |
| **🔐 Auth & State** | Pre-login via storage state, guest vs authorized projects, token-based API auth |
| **🤖 AI-Ready** | Cursor agents for test generation, healing, and planning |
| **⏱️ Performance** | Configurable response-time thresholds, retry for flaky endpoints |

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [What's Tested](#-whats-tested)
- [Project Structure](#-project-structure)
- [Framework Architecture](#-framework-architecture)
- [Tech Stack](#-tech-stack)
- [Advanced Features](#-advanced-features)
- [Running Tests](#-running-tests)
- [Reports](#-reports)
- [Environment Configuration](#-environment-configuration)
- [Documentation](#-documentation)
- [Design & Rationale](#-design--rationale)
- [License & Contact](#-license--contact)

---

## 🚀 Quick Start

```bash
# Install
npm install

# Run everything (BDD + TDD + API)
npm run test:all

# Or run layers individually
npm run test:bdd    # Cucumber BDD (OrangeHRM)
npm run test:tdd    # Playwright UI specs
npm run test:api    # Restful-Booker API
```

> **Prerequisites:** Node 18+, npm. Copy `src/ui/helpers/env/.env.example` to `.env` and configure `BASE_URL`, credentials. For API tests, configure `src/api/env/.env.example`.

---

## 🎯 What's Tested

### UI (OrangeHRM) — BDD & TDD

| Module | Feature File | Scenarios | Coverage |
|--------|--------------|-----------|----------|
| **Login** | `login.feature` | 8 | Valid/invalid credentials, empty fields, mixed casing, special chars |
| **Admin** | `admin.feature` | 7 | User management, uniqueness, validation, search, status filter |
| **Recruitment** | `jobPosting.feature` | 10+ | Vacancy CRUD, mandatory validation, scenario outlines |

### API (Restful-Booker)

| Spec | Endpoints | Coverage |
|------|-----------|----------|
| **Health** | `GET /ping` | Status 201, response-time threshold |
| **Auth** | `POST /auth` | Token creation, validation |
| **Booking** | CRUD | Create, get, update, partial update, delete, list IDs |

---

## 📁 Project Structure

```
ai-playwright-hybrid-framework/
│
├── cucumber.mjs                        # Cucumber BDD configuration
│
├── src/
│   ├── ui/                             # UI Testing Layer (BDD + TDD)
│   │   ├── constants/                  # Selectors, global.ts, resources.ts
│   │   ├── helpers/
│   │   │   ├── browsers/               # browserSetup.ts
│   │   │   ├── env/                    # .env, env.ts, getEnv.ts
│   │   │   ├── reports/                # report.ts, allureMetadata, cucumberReportMetadata
│   │   │   ├── hooks/                  # hooks.ts, orangeHRMWorld.ts
│   │   │   └── setupLogin/auth/        # Pre-auth storage state
│   │   ├── pages/                      # POM: Login, Dashboard, Admin, Vacancy
│   │   ├── stepDefinitions/            # Gherkin bindings per feature
│   │   ├── tdd/                        # Playwright UI specs, fixtures, globalSetup
│   │   ├── tests/
│   │   │   ├── data/                   # Test data (login, admin, pim, recruitment)
│   │   │   └── features/               # .feature files (login, admin, jobPosting)
│   │   ├── utils/                      # Assertions, logger, locator, api, date, random
│   │   └── scripts/                    # run-bdd-tests.mjs
│   │
│   └── api/                            # API Testing Layer (isolated, no UI)
│       ├── base/                       # BaseAPI (SOLID)
│       ├── builders/                   # RequestBuilder (fluent API)
│       ├── client/                     # restfulBookerClient, restfulBookerClientWithReport
│       ├── config/                     # apiEnv.ts
│       ├── fixtures/                   # apiFixtures.ts
│       ├── helpers/                    # reportAttach, responseWithAttach
│       ├── interceptors/               # LoggingInterceptor
│       ├── mocks/                      # MockResponseBuilder
│       ├── validators/                 # SchemaValidator (ajv), ResponseValidator
│       ├── specs/                      # auth, booking, healthCheck
│       ├── utils/                      # retry utility
│       └── types/                      # restfulBooker.types.ts
│
├── test-results/                       # BDD, TDD, API outputs (screenshots, videos)
├── playwright-report/                  # Playwright HTML reports
├── allure-report/                      # Allure results & serve
├── docs/                               # ALLURE, API-README, framework, migration, etc.
│
├── playwright.config.ts               # TDD config (guest vs authorized projects)
├── playwright.api.config.ts           # API-only config
├── convert-cucumber-to-junit.mjs       # Cucumber JSON → JUnit XML
└── package.json
```

---

## 🏛️ Framework Architecture

```
                         ┌──────────────────────────┐
                         │   Feature Files (BDD)    │
                         │   Gherkin scenarios      │
                         └────────────┬─────────────┘
                                      ▼
                         ┌──────────────────────────┐
                         │   Step Definitions       │
                         │   Glue code to POM       │
                         └────────────┬─────────────┘
                                      ▼
                         ┌──────────────────────────┐
                         │   Page Objects (POM)     │
                         │   Encapsulated UI logic   │
                         └────────────┬─────────────┘
                                      │
          ┌──────────────────────────┼──────────────────────────┐
          ▼                          ▼                          ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  API Utilities   │      │ Custom Assertions │      │ Wrapper Locators │
│  (BDD context)   │      │  Field/History    │      │  Reusable layer  │
└────────┬─────────┘      └────────┬─────────┘      └────────┬─────────┘
         └─────────────────────────┼─────────────────────────┘
                                   ▼
                         ┌──────────────────────────┐
                         │  Playwright Browser      │
                         │  Hooks · Storage State   │
                         │  Custom World            │
                         └────────────┬─────────────┘
                                      ▼
                         ┌──────────────────────────┐
                         │  Reporting Layer         │
                         │  HTML · JUnit · Allure   │
                         └──────────────────────────┘
```

**Layer mapping:**

| Layer | Entry Point | Config | Output |
|-------|-------------|--------|--------|
| **BDD** | Feature files → Step defs → POM | `cucumber.mjs` | Cucumber JSON/HTML, JUnit |
| **TDD** | `*.spec.ts` → Fixtures → POM | `playwright.config.ts` | Playwright HTML, Allure |
| **API** | `*.spec.ts` → Client → BaseAPI | `playwright.api.config.ts` | JUnit, Allure |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Playwright** | UI (OrangeHRM) & API (Restful-Booker) |
| **Cucumber v11** | BDD with Gherkin |
| **TypeScript 5.7** | Full type safety |
| **POM** | Login, Dashboard, Admin, Vacancy pages |
| **Allure** | Unified BDD, TDD, API reports |
| **AJV** | JSON schema validation for API responses |
| **multiple-cucumber-html-reporter** | Custom BDD HTML reports |
| **xunit-viewer** | JUnit XML → HTML |
| **dotenv** | Multi-environment config |

---

## 🔬 Advanced Features

### API Layer

- **BaseAPI** — Abstract base following SOLID; centralizes URL, headers, and request flow.
- **RequestBuilder** — Fluent API for `.path()`, `.method()`, `.body()`, `.headers()`, `.timeout()`, `.skipRetry()`.
- **SchemaValidator** — JSON schema validation via `ajv`; used for auth and booking responses.
- **LoggingInterceptor** — Optional request/response logging via `API_LOG_REQUESTS` or `DEBUG`.
- **Retry** — Configurable retry for flaky endpoints (`/auth`, `/booking`).
- **responseWithAttach** — Attaches request/response to Playwright report without consuming body twice.
- **MockResponseBuilder** — Support for mocking API responses.

### UI Layer

- **Storage State** — Pre-authenticated `admin-user.json` for authorized specs.
- **Guest vs Authorized Projects** — Separate Playwright projects for login (guest) vs admin/recruitment (authorized).
- **Custom Hooks & World** — `orangeHRMWorld` for shared context; `BeforeAll`/`AfterAll` auth.
- **Wrapper Locators** — Reusable locator layer for consistency.
- **Custom Assertions** — Field, history, PIM, admin, login assertions.

### DevOps & AI

- **Cursor Agents** — `.github/agents/` includes `playwright-test-generator`, `playwright-test-healer`, `playwright-test-planner`.
- **AI Test Generator** — `src/ui/utils/ai/TEST-GENERATOR-PROMPT.md` for guided test creation.
- **Azure Integration** — Scripts for linking automation to manual test cases.

---

## ▶️ Running Tests

### BDD (Cucumber)

```bash
npm run test:bdd              # Default (headless)
npm run test:bdd:headed       # Headed browser
npm run test:bdd:smoke        # @smoke tag
npm run test:bdd:regression   # @regression tag
npm run test:bdd:progress     # Progress profile
npm run test:bdd:chromium     # Chromium only
npm run test:bdd:firefox      # Firefox only
npm run test:bdd:webkit       # WebKit only
```

### TDD (Playwright UI)

```bash
npm run test:tdd
npm run test:tdd:headed
npm run test:tdd:ui           # Interactive UI mode
npm run test:tdd:smoke
npm run test:tdd:regression
npm run test:tdd:chromium
npm run test:tdd:firefox
npm run test:tdd:webkit
npm run test:tdd:mobile       # Mobile viewport
npm run test:tdd:junit        # CI mode (JUnit output)
npm run test:tdd:log          # Run with logging
```

### API (Restful-Booker)

```bash
npm run test:api
npm run test:api:ui
npm run test:api:smoke
npm run test:api:regression
npm run test:api:junit        # CI mode
```

### Lint & Type Check

```bash
npm run tsc                   # TypeScript check
npm run lint                  # ESLint
npm run lint:fix              # ESLint auto-fix
```

---

## 📊 Reports

| Command | Output |
|---------|--------|
| `npm run report:bdd` | Cucumber HTML report |
| `npm run report:bdd:all` | Cucumber HTML + JUnit conversion + JUnit viewer |
| `npm run report:tdd` | Playwright HTML (TDD) |
| `npm run report:tdd:all` | All TDD reports |
| `npm run report:api` | API JUnit viewer |
| `npm run allure:all` | Allure generate + serve (BDD + TDD) |
| `npm run allure:api:all` | Allure generate + serve (API) |
| `npm run allure:open` | Open existing Allure report |

---

## ⚙️ Environment Configuration

### UI

| File | Purpose |
|------|---------|
| `src/ui/helpers/env/.env` | Local config (gitignored) |
| `src/ui/helpers/env/env.ts` | Environment types |
| `src/ui/helpers/env/getEnv.ts` | Centralized loader |

Variables: `BASE_URL`, `USERNAME`, `PASSWORD`, `BROWSER`, `HEADLESS`, etc.

### API

| File | Purpose |
|------|---------|
| `src/api/env/.env.example` | Template for API creds |
| `src/api/config/apiEnv.ts` | Base URL, credentials, `responseTimeThreshold` |

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [docs/ALLURE-REPORT.md](docs/ALLURE-REPORT.md) | Allure setup & usage |
| [docs/API-README.md](docs/API-README.md) | API layer details |
| [docs/framework.md](docs/framework.md) | Framework overview |
| [docs/FrameworkExplanation.md](docs/FrameworkExplanation.md) | Design rationale |
| [docs/PLAYWRIGHT-API-REPORT.md](docs/PLAYWRIGHT-API-REPORT.md) | API reporting |
| [docs/migration.md](docs/migration.md) | Migration notes |
| [docs/variableRules.md](docs/variableRules.md) | Variable conventions |

---

## 🧠 Design & Rationale

### Why This Framework Is Strong

| Principle | Implementation |
|-----------|----------------|
| **Modular** | Clear UI vs API separation; no UI code in API layer |
| **Scalable** | New module = new feature + page class; core unchanged |
| **Type-Safe** | TypeScript end-to-end; typed API clients and schemas |
| **Environment-Independent** | `.env`-driven; switch dev/qa/stage without code changes |
| **CI-Ready** | JUnit XML, Allure artifacts, parallel execution, retries in CI |

### Design Decisions

1. **Feature Layer** — Gherkin for product/QA collaboration; business-readable scenarios.
2. **Step Definitions** — Thin glue; logic delegated to POM.
3. **Page Objects** — Private locators; public business methods; encapsulation.
4. **Utility Layer** — Custom API wrappers, assertions, date utils, logger, random data.
5. **Env Layer** — `getEnv()` centralizes all config.
6. **Hooks & World** — Shared context, storage state, lifecycle control.
7. **Reporting** — Multiple formats for humans (HTML) and CI (JUnit, Allure).

### Scalability

- **Add a new module:** New feature file + step def + page class — no core changes.
- **Add a new API:** Extend `BaseAPI`, add client methods, add specs.
- **Add a new environment:** New `.env.xyz` file; `NODE_ENV=xyz` at runtime.

---

## 📄 License & Contact

| | |
|---|---|
| **License** | ISC |
| **Author** | Pratik Raut |
| **Email** | pratikraut840@gmail.com |
| **GitHub** | [pratikraut840](https://github.com/pratikraut840) |
