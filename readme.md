===========================================================
# Playwright OrangeHRM Framework – Project Structure
===========================================================

OrangeHRM-project/
│
├── cucumber.mjs                        # Cucumber BDD configuration
│
├── src/
│   │
│   ├── ui/                             # Dedicated UI Testing Layer (BDD + TDD)
│   │   ├── constants/
│   │   │   ├── selectors/              # Common & reusable selectors
│   │   │   ├── global.ts               # UI labels/constants
│   │   │   └── resources.ts            # API endpoint constants
│   │   │
│   │   ├── helpers/
│   │   │   ├── browsers/browserSetup.ts
│   │   │   ├── env/                    # .env, env.ts, getEnv.ts
│   │   │   ├── reports/report.ts
│   │   │   ├── scripts/                # view-junit, show-tdd-report, allure-open, etc.
│   │   │   ├── setupLogin/auth/
│   │   │   └── hooks/                  # hooks.ts, orangeHRMWorld.ts
│   │   │
│   │   ├── pages/                      # All POM pages
│   │   ├── stepDefinitions/            # Step definitions (Gherkin bindings)
│   │   ├── tdd/                        # TDD layer (Playwright UI specs)
│   │   │   ├── fixtures/
│   │   │   ├── specs/
│   │   │   └── globalSetup.ts
│   │   │
│   │   ├── tests/
│   │   │   ├── data/
│   │   │   └── features/               # Cucumber feature files
│   │   │
│   │   ├── scripts/                    # run-bdd-tests.mjs
│   │   ├── types/
│   │   └── utils/                      # assertions, logger, locator, api, etc.
│   │
│   └── api/                            # Dedicated API Testing Layer (no UI mixing)
│       ├── config/apiEnv.ts            # Base URL, credentials
│       ├── base/BaseAPI.ts             # Base request handling
│       ├── client/                     # restfulBookerClient, restfulBookerClientWithReport
│       ├── constants/endpoints.ts      # Restful-Booker endpoints
│       ├── fixtures/apiFixtures.ts
│       ├── helpers/                    # reportAttach, responseWithAttach
│       ├── specs/                      # auth, booking, healthCheck
│       ├── data/restfulBooker.data.ts
│       ├── env/                        # .env, .env.example (auth creds)
│       ├── validators/                 # SchemaValidator, schemas
│       └── types/restfulBooker.types.ts
│
├── test-results/                      # All test outputs (BDD, TDD, API)
│   ├── test-results-bdd/               # BDD (Cucumber) outputs
│   │   ├── cucumber-json/              # Cucumber JSON output
│   │   ├── cucumber-html-report/       # Customized HTML reports
│   │   ├── junit-report/               # JUnit XML & HTML
│   │   ├── screenshots/                # Failure screenshots
│   │   └── videos/                     # Failure video captures
│   ├── test-results-tdd/               # TDD (Playwright) raw outputs
│   └── test-results-api/               # API layer raw + junit-report-api/
│
├── playwright-report/                  # Playwright HTML reports
│   ├── playwright-report-tdd/          # TDD (Playwright) HTML report
│   └── playwright-report-api/          # API layer HTML report
│
├── allure-report/                      # Allure reports (generate + serve)
│
├── playwright.config.ts               # Playwright config for TDD (UI) tests
├── playwright.api.config.ts           # Playwright config for API-only tests
├── convert-cucumber-to-junit.mjs       # Converts Cucumber JSON → JUnit XML
│
├── package.json                        # Project dependencies & scripts
├── package-lock.json                   # Auto-generated lock file
├── tsconfig.json                       # TypeScript configuration
└── README.md

===========================================================
# Framework Architecture Overview
===========================================================

                          ┌──────────────────────────┐
                          │      Feature Files       │
                          │     (Cucumber - BDD)     │
                          └────────────┬─────────────┘
                                       │
                                       ▼
                          ┌──────────────────────────┐
                          │     Step Definitions     │
                          │   (Glue Code Layer)      │
                          └────────────┬─────────────┘
                                       │
                                       ▼
                          ┌──────────────────────────┐
                          │      Page Objects (POM)   │
                          │  Encapsulated UI Actions │
                          └────────────┬─────────────┘
                                       │
             ┌─────────────────────────┼─────────────────────────┐
             ▼                         ▼                         ▼
   ┌─────────────────┐     ┌──────────────────┐       ┌──────────────────┐
   │  API Utilities  │     │  Custom Assertions│       │  Wrapper Locators │
   │ (GET/POST/PUT)  │     │  Field/History   │       │  Reusable Layer   │
   └─────────────────┘     └──────────────────┘       └──────────────────┘
             │                         │                         │
             └───────────────┬─────────┴───────────────┬─────────┘
                             ▼                         ▼
                   ┌──────────────────┐      ┌──────────────────┐
                   │  Common Utilities │      │  Environment     │
                   │  Date, Random,    │      │  Config (.env)   │
                   │  Logger, Helpers  │      │  getEnv()        │
                   └──────────┬───────┘      └──────────┬───────┘
                              │                         │
                              ▼                         ▼
                      ┌────────────────────────────────────────┐
                      │        Playwright Browser Layer        │
                      │        Hooks & Custom World            │
                      └────────────────────────────────────────┘
                                      │
                                      ▼
                      ┌────────────────────────────────────────┐
                      │        Reporting Layer                 │
                      │  Cucumber JSON → HTML → JUnit XML      │
                      │  Allure (BDD + TDD + API)              │
                      └────────────────────────────────────────┘

===========================================================
# Playwright Framework Architecture Design
===========================================================

This hybrid framework is built using:

- **Playwright** — UI automation (OrangeHRM) and API automation (Restful-Booker)
- **Cucumber** — BDD implementation with Gherkin feature files
- **TypeScript** — Type-safe implementation
- **POM (Page Object Model)** — Encapsulated UI interactions in page classes
- **Allure Reporting** — Unified dashboards for BDD, TDD, and API layers
- **Custom Reporting** — multiple-cucumber-html-reporter, Cucumber JSON, JUnit XML, xunit-viewer
<!-- - **CI/CD Ready** — Bitbucket and GitHub Actions compatible (JUnit, Allure artifacts) -->
- **Custom Hooks & World** — BeforeAll/AfterAll auth, storage state, per-scenario lifecycle
- **Multi-browser** — Chromium, Firefox, WebKit
- **Multi-environment** — `.env` per environment (dev, qa, stage)

<!-- Architecture Design -->
**Hybrid Framework:** Supports BDD (Cucumber), TDD (Playwright UI), and a Dedicated API layer.
- BDD Layer → Feature files (Gherkin) → Step definitions → POM
- TDD Layer → Spec files (*.spec.ts) → Fixtures + POM (UI only)
- API Layer → Spec files (*.spec.ts) → API client + fixtures (no browser, no UI mixing)
- Shared → Page Objects, utilities, assertions, env config (for UI layers)

<!-- Layer Details -->
BDD Layer → Feature files (Gherkin)
Step Definition Layer → Glue between feature & logic
Page Object Layer → Encapsulated UI actions
Utility Layer → API, Assertions, Date, Logger, Random
Environment Layer → Multi-environment support
Reporting Layer → Custom report generation + Allure
Bitbucket Pipeline Integration → Sync automation results to manual test cases

<!-- Running Tests -->
  BDD:  npm run test:bdd    (or npm run test, test:smoke, test:regression, test:headed)
  TDD:  npm run test:tdd    (or test:tdd:headed, test:tdd:ui, test:tdd:smoke)
  API:  npm run test:api    (or test:api:ui) – Dedicated API layer, Restful-Booker
  All:  npm run test:all

<!-- Environment Configuration -->
src/ui/helpers/env/
   ├── .env
   ├── env.ts
   └── getEnv.ts


===========================================================
# Framework Explanation (Interview-Ready Version)
===========================================================
I designed a scalable, maintainable and enterprise-ready automation framework using Playwright with Cucumber BDD and TypeScript. The goal was to ensure maintainability, scalability, multi-environment support, and seamless Bitbucket Pipeline integration.

1. The framework follows a modular and layered architecture with clear separation of concerns —
    Feature layer for business-readable scenarios,
    Step Definition layer for glue logic,
    and a Page Object Model layer for encapsulated UI interactions.
2. I also implemented a utility layer that includes custom API wrappers, assertions, date handling, random data generation, and centralized logging.
3. The framework supports multi-environment execution using .env configuration management and integrates with CI/CD by converting test results into HTML, JUnit, and Allure reports.
4. Additionally, I implemented custom hooks and world constructors for context sharing and improved test lifecycle control.
5. The result is a highly modular, maintainable, and enterprise-ready automation solution.

===========================================================
# How I Designed the Framework
===========================================================
I designed a scalable Playwright automation framework using Cucumber with a clear separation of concerns.

1️⃣ Feature Layer (BDD)
    Business-readable Gherkin scenarios
    Product owners can understand scenarios
    Promotes collaboration between QA, Dev, and BA

2️⃣ Step Definition Layer
    Acts as glue between feature files and logic
    Keeps feature files clean and reusable
    Delegates logic to Page Object layer

3️⃣ Page Object Model (POM) Layer
    All UI actions encapsulated in page classes
    Locators kept private
    Public business methods exposed
    Follows encapsulation & abstraction principles

4️⃣ Utility Layer
    "Instead of relying only on Playwright's default utilities, I created a reusable utility layer."
    Includes:
    API wrapper (GET, POST, PUT)
    Custom assertion library
    Date utilities (region-specific handling)
    Random data generator
    Logger for centralized failure tracking

5️⃣ Environment Layer
    "Framework supports multi-environment execution using .env files with centralized getEnv() configuration management."
    Folder:
        src/ui/helpers/env/
        ├── .env
        ├── env.ts
        └── getEnv.ts
    Benefits:
        Dev / QA / UAT switch
        No hardcoded values
        CI-friendly

6️⃣ Custom Hooks & World (Cucumber Advanced)
    "Implemented custom hooks and world constructor to manage object injection and test context sharing across steps."

7️⃣ Reporting Layer
    "Cucumber JSON output is converted to HTML and JUnit XML. Allure reports (BDD, TDD, API) provide unified dashboards. All integrate with CI pipelines."
    Highlights:
    HTML for humans
    JUnit for CI
    Allure for unified reporting

8️⃣ CI Integration
    "Automation results are synchronized with Aqua to update manual test cases. This ensures traceability between automated and manual testing efforts."

9️⃣ Why This Framework Is Strong
    "The framework is modular, scalable, environment-independent, and supports both UI and API automation. It follows clean architecture principles and supports enterprise-level reporting and CI/CD integration."

===========================================================
# Why This Framework Is Strong
===========================================================
    Highly modular & maintainable
    Easy to scale for new modules
    Clear separation of concerns
    API + UI combined support (BDD, TDD, API layers)
    Custom assertion system (not dependent only on Playwright expect)
    Environment-independent execution
    Enterprise-level reporting (HTML, JUnit, Allure)

===========================================================
# How Is It Scalable?
===========================================================
    New modules only need new feature + page class
    No core changes
    Reusable utilities
    Environment independent
    CI-ready
