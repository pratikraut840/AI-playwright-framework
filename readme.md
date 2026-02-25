# AI Playwright Hybrid Automation Framework

[![Node](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.58+-blue.svg)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

Enterprise-ready automation framework with **Playwright**, **Cucumber BDD**, and **TypeScript** — supporting UI (BDD + TDD) and API testing layers.

## Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Framework Architecture](#framework-architecture)
- [Tech Stack](#tech-stack)
- [Running Tests](#running-tests)
- [Environment Configuration](#environment-configuration)
- [Design & Rationale](#design--rationale)

---

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests (BDD + TDD + API)
npm run test:all

# Run individual layers
npm run test:bdd    # Cucumber BDD
npm run test:tdd    # Playwright UI specs
npm run test:api    # Restful-Booker API
```

---

## Project Structure

```
ai-playwright-hybrid-framework/
│
├── cucumber.mjs                        # Cucumber BDD configuration
│
├── src/
│   ├── ui/                             # UI Testing Layer (BDD + TDD)
│   │   ├── constants/                  # Selectors, global.ts, resources.ts
│   │   ├── helpers/                    # Browser, env, reports, hooks, auth
│   │   ├── pages/                      # Page Object Model (POM)
│   │   ├── stepDefinitions/             # Gherkin step definitions
│   │   ├── tdd/                        # Playwright UI specs, fixtures
│   │   ├── tests/                      # Features, data
│   │   ├── scripts/                    # run-bdd-tests.mjs
│   │   ├── types/
│   │   └── utils/                      # Assertions, logger, locator, api
│   │
│   └── api/                            # API Testing Layer (no UI)
│       ├── config/                     # apiEnv.ts
│       ├── base/                       # BaseAPI.ts
│       ├── client/                     # API clients
│       ├── constants/                  # endpoints.ts
│       ├── fixtures/                   # apiFixtures.ts
│       ├── specs/                      # auth, booking, healthCheck
│       ├── validators/                 # Schema validation
│       └── types/
│
├── test-results/                       # BDD, TDD, API outputs
├── playwright-report/                  # Playwright HTML reports
├── allure-report/                      # Allure reports
│
├── playwright.config.ts                # TDD (UI) config
├── playwright.api.config.ts            # API-only config
├── convert-cucumber-to-junit.mjs       # Cucumber JSON → JUnit XML
└── package.json
```

---

## Framework Architecture

```
                    ┌──────────────────────────┐
                    │   Feature Files (BDD)    │
                    └────────────┬─────────────┘
                                 ▼
                    ┌──────────────────────────┐
                    │   Step Definitions       │
                    └────────────┬─────────────┘
                                 ▼
                    ┌──────────────────────────┐
                    │   Page Objects (POM)     │
                    └────────────┬─────────────┘
                                 │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐      ┌────────────────┐      ┌─────────────────┐
│ API Utilities │      │ Custom Assert  │      │ Wrapper Locators│
└───────┬───────┘      └────────┬───────┘      └────────┬────────┘
        └───────────────────────┼───────────────────────┘
                                ▼
                    ┌──────────────────────────┐
                    │  Playwright Browser      │
                    │  Hooks & Custom World    │
                    └────────────┬─────────────┘
                                 ▼
                    ┌──────────────────────────┐
                    │  Reporting Layer         │
                    │  HTML · JUnit · Allure   │
                    └──────────────────────────┘
```

**Hybrid layers:**

| Layer | Description |
|-------|-------------|
| **BDD** | Feature files (Gherkin) → Step definitions → POM |
| **TDD** | Spec files (`*.spec.ts`) → Fixtures + POM (UI only) |
| **API** | Spec files (`*.spec.ts`) → API client + fixtures (no browser) |

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Playwright** | UI (OrangeHRM) & API (Restful-Booker) automation |
| **Cucumber** | BDD with Gherkin feature files |
| **TypeScript** | Type-safe implementation |
| **POM** | Page Object Model for UI interactions |
| **Allure** | Unified reporting for BDD, TDD, API |
| **Custom Reporting** | Cucumber HTML, JUnit XML, xunit-viewer |
| **Custom Hooks & World** | Auth, storage state, scenario lifecycle |
| **Multi-browser** | Chromium, Firefox, WebKit |
| **Multi-environment** | `.env` per dev / qa / stage |

---

## Running Tests

### BDD (Cucumber)
```bash
npm run test:bdd              # Default run
npm run test:bdd:headed       # Headed mode
npm run test:bdd:smoke        # @smoke tag
npm run test:bdd:regression   # @regression tag
npm run test:bdd:chromium     # Chromium only
```

### TDD (Playwright UI)
```bash
npm run test:tdd
npm run test:tdd:headed
npm run test:tdd:ui           # Interactive UI mode
npm run test:tdd:smoke
```

### API (Restful-Booker)
```bash
npm run test:api
npm run test:api:ui
```

### Reports
```bash
npm run report:bdd:all        # BDD reports
npm run report:tdd            # TDD HTML report
npm run allure:all            # Allure (BDD + TDD)
npm run allure:api:all        # Allure (API)
```

---

## Environment Configuration

Environment config in `src/ui/helpers/env/`:

```
├── .env          # Local credentials (gitignored)
├── env.ts        # Environment types
└── getEnv.ts     # Centralized config loader
```

Create `.env` from `.env.example` and set `BASE_URL`, credentials, etc.

---

## Design & Rationale

### Design decisions

1. **Feature layer** — Business-readable Gherkin for product/QA collaboration
2. **Step definitions** — Glue between features and logic
3. **Page objects** — Encapsulated UI, private locators, public methods
4. **Utility layer** — Custom API wrappers, assertions, date utils, logger
5. **Env layer** — Centralized `getEnv()` for multi-environment support
6. **Hooks & World** — Context sharing and test lifecycle control
7. **Reporting** — Cucumber JSON → HTML/JUnit, plus Allure dashboards

### Why this framework is strong?

- **Modular** — Clear separation of concerns across layers
- **Scalable** — New modules = new feature + page class only
- **Hybrid** — BDD, TDD, and API layers in one framework
- **Environment-independent** — `.env`-based config
- **Enterprise reporting** — HTML, JUnit, Allure for CI pipelines

### How Is It Scalable?

- New modules only need new feature + page class
- No core changes required
- Reusable utilities across layers
- Environment independent
- CI-ready outputs (JUnit, Allure artifacts)

---

## License

ISC

---

## Owner

Pratik Raut

---

## Contact

pratikraut840@gmail.com
