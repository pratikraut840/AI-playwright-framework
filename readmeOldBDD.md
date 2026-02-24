===========================================================
# Playwright OrangeHRM Framework – Project Structure
===========================================================

OrangeHRM-project/
│
├── src/
│   │
│   ├── constants/
│   │   ├── selectors/                  # Common & reusable selectors
│   │   ├── global.ts                   # UI labels/constants
│   │   └── resources.ts                # API endpoint constants
│   │
│   ├── helpers/
│   │   ├── browsers/
│   │   │   └── browserSetup.ts         # Browser initialization logic
│   │   │
│   │   ├── config/
│   │   │   └── cucumber.mjs             # Cucumber configuration
│   │   │
│   │   ├── env/
│   │   │   ├── .env
│   │   │   ├── env.ts                  # Environment configs (URL, credentials, API endpoints)
│   │   │   └── getEnv.ts               # getEnv() utility function
│   │   │
│   │   ├── reports/
│   │   │   └── report.ts               # Generate multiple cucumber reports
│   │   │
│   │   ├── setupLogin/
│   │   │   └── auth/
│   │   │       └── user.json           # Stored authentication cookies/session
│   │   │
│   │   └── hooks/
│   │       ├── hooks.ts                # before, beforeAll, after, afterAll
│   │       └── orangeHRMWorld.ts       # Custom world (object creation setup)
│   │
│   ├── pages/                          # All POM pages
│   │
│   ├── stepDefinitions/                # Step definitions (Gherkin bindings)
│   │
│   ├── tests/
│   │   ├── data/
│   │   │   ├── apiData/
│   │   │   │   ├── login.ts
│   │   │   │   ├── pim.ts              # API payload data
│   │   │   │   └── admin.ts            # API payload data
│   │   │   │
│   │   │   ├── automationRules.ts
│   │   │   ├── login.ts
│   │   │   ├── homepage.ts
│   │   │   ├── pim.ts
│   │   │   └── admin.ts                # UI page test data
│   │   │
│   │   └── features/                   # Cucumber feature files
│   │       ├── login.feature
│   │       ├── pim.feature
│   │       └── admin.feature
│   │
│   ├── types/                          # All TypeScript interfaces/types
│   │   ├── automationRules.types.ts
│   │   ├── login.types.ts
│   │   ├── pim.types.ts
│   │   ├── admin.types.ts
│   │   └── common.types.ts
│   │
│   └── utils/
│       │
│       ├── api/
│       │   └── apiMethods.ts           # Common API methods (GET, POST, PUT)
│       │
│       ├── assertions/
│       │   ├── fieldAssertion.ts       # Custom assertions
│       │   ├── loginAssertions.ts      # Custom assertions
│       │   ├── pimAssertions.ts        # Custom assertions
│       │   └── adminAssertions.ts      # Custom assertions
│       │
│       ├── auth/
│       │   └── token.ts                # Get token from local storage
│       │
│       ├── common/
│       │   ├── generateAndRun.ts      # utility func to create & run data in same format
│       │   └── random.ts               # generateRandomNum(), generateRandomStr()
│       │
│       ├── date/
│       │   └── format.ts               # Date utilities
│       │                               # getCurrentFormattedDate()
│       │                               # parseDateByRegion()
│       │                               # verifyDates()
│       │                               # generateDateByRegion()
│       │
│       ├── locator/
│       │   └── wrapperLocator.ts       # Locator wrapper utility
│       │
│       └── logger/
│           ├── failureLogger.ts        # writeFailureLog()
│           └── logger.ts               # enableDebugFileLogging()
│
├── test-results/
│   ├── cucumber-json/                  # Cucumber JSON output
│   ├── cucumber-html-report/           # Customized HTML reports
│   ├── junit-report/                   # JUnit XML & HTML
│   ├── playwright-report/             # Playwright HTML report (when using npx playwright test)
│   ├── screenshots/                    # Failure screenshots
│   └── videos/                         # Failure video captures
│
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
                      │                               │
                      └────────────────────────────────────────┘

===========================================================
# Playwright OrangeHRM Automation Framework
===========================================================

This framework is built using:
    Playwright (UI + API automation)
    Cucumber (BDD implementation)
    TypeScript
    POM (Page Object Model)
    Bitbucket Pipeline Integration
    Custom Reporting (HTML + JSON + JUnit)

<!-- Architecture Design -->
BDD Layer → Feature files (Gherkin)
Step Definition Layer → Glue between feature & logic
Page Object Layer → Encapsulated UI actions
Utility Layer → API, Assertions, Date, Logger, Random
Environment Layer → Multi-environment support
Reporting Layer → Custom report generation
Bitbucket Pipeline Integration → Sync automation results to manual test cases

<!-- Environment Configuration -->
helpers/env/
   ├── .env
   ├── env.ts
   └── getEnv.ts


===========================================================
# Framework Explanation (Interview-Ready Version)
===========================================================

I designed a scalable and enterprise-ready automation framework for OrangeHRM using Playwright with Cucumber BDD and TypeScript. The goal was to ensure maintainability, scalability, multi-environment support, and seamless Bitbucket Pipeline integration.

1. The framework follows a layered architecture with clear separation of concerns —
    Feature layer for business-readable scenarios,
    Step Definition layer for glue logic,
    and a Page Object Model layer for encapsulated UI interactions.
2. I also implemented a utility layer that includes custom API wrappers, assertions, date handling, random data generation, and centralized logging.
3. The framework supports multi-environment execution using .env configuration management and integrates with Bitbucket pipelines by converting test results into HTML and JUnit reports.
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
        helpers/env/
        ├── .env
        ├── env.ts
        └── getEnv.ts
    Benefits:
        Dev / QA / UAT switch
        No hardcoded values
        Bitbucket Pipeline-friendly

6️⃣ Custom Hooks & World (Cucumber Advanced)
    "Implemented custom hooks and world constructor to manage object injection and test context sharing across steps."

7️⃣ Reporting Layer
    "Cucumber JSON output is converted to HTML and JUnit XML, which integrates with Bitbucket pipelines."
    Highlights:
    HTML for humans
    JUnit for Bitbucket pipelines

8️⃣ Bitbucket Pipeline Integration
    "Automation results are synchronized with Aqua to update manual test cases. This ensures traceability between automated and manual testing efforts."

9️⃣ Why This Framework Is Strong
    "The framework is modular, scalable, environment-independent, and supports both UI and API automation. It follows clean architecture principles and supports enterprise-level reporting and Bitbucket Pipeline integration."

===========================================================
# Why This Framework Is Strong
===========================================================
    Highly modular & maintainable
    Easy to scale for new modules
    Clear separation of concerns
    API + UI combined support
    Custom assertion system (not dependent only on Playwright expect)
    Environment-independent execution
    Enterprise-level reporting

===========================================================
# How Is It Scalable?
===========================================================
    New modules only need new feature + page class
    No core changes
    Reusable utilities
    Environment independent
    Bitbucket pipeline-ready
