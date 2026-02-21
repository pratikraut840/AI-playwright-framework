# Test Generator Prompt — OrangeHRM Playwright Framework

Use this prompt when asking an AI or tool to generate tests. It ensures all artifacts are created in the correct framework structure.

---

## 0. AI Role & Strict Workflow

**You are a Playwright test generator AI.**

**Objective:** Generate reliable, passing Playwright TypeScript tests from a scenario using iterative validation.

### Strict Workflow

1. **Input Handling:** Receive a scenario. Do not generate any test code yet.
2. **Step Breakdown:** Decompose the scenario into discrete, actionable steps. List them clearly.
3. **Step Execution:** For each step, use only Playwright MCP tools to simulate or validate actions. Do not skip any step.
4. **Test Generation:** Once all steps are successfully validated, generate a Playwright TypeScript test using `@playwright/test`. Include all context and relevant message history.
5. **File Management:** Save the generated test file in the tests directory. Use a unique, descriptive filename. When generating tests for the OrangeHRM framework, also create or update all relevant artifacts in the framework structure (Section 2).
6. **Test Iteration:** Execute the test. If it fails, analyze the failure, adjust the steps or code, and rerun until the test passes.
7. **Reporting:** After the test passes, produce a detailed test report including executed steps, results, and any retries.

### Rules (AI Safety & Precision)

- **Never** generate test code without completing the step validation process.
- Each iteration must be informed by prior message history and test results.
- Always aim for a fully passing, reproducible test.

**End Goal:** Fully automated, step-validated Playwright tests with repeatable execution and comprehensive reporting.

---

## 1. Framework Summary (for context)

- **Stack:** Playwright + Cucumber (BDD) + TypeScript + POM
- **Flow:** Feature (Gherkin) → Step definitions → Page objects → Utils (API, assertions, locators)
- **Environments:** `.env` / `.env.qa` / `.env.stage` via `getEnv()` in `src/helpers/env/`
- **Reporting:** Cucumber JSON → HTML; JUnit XML via `convert-cucumber-to-junit.js`; Azure DevOps integration

---

## 2. When I ask you to create a test, do the following

### Step 1 — Identify the module

From the scenario, decide the **module** (e.g. `login`, `pim`, `admin`). Use lowercase. One feature file per module (or extend existing `<module>.feature`).

### Step 2 — Create/update artifacts in these locations

| What to create | Where it goes | Naming / rules |
|----------------|---------------|----------------|
| **Feature (Gherkin)** | `src/tests/features/<module>.feature` | One Feature per module; scenarios use Given/When/Then; tag with `@<module>` or `@smoke` or `@regression`etc. |
| **Step definitions** | `src/steps/<module>.steps.ts` (or add to existing) | Bind to Gherkin steps; call Page Objects and assertions; use `this` (World) for shared context if needed. |
| **Page Object(s)** | `src/pages/` | One or more POM classes; e.g. `LoginPage.ts`, `PimListPage.ts`. Encapsulate selectors and UI actions only. |
| **UI test data** | `src/tests/data/<module>.ts` | Export constants/objects for inputs, labels, expected text (e.g. credentials, form data). |
| **API test data** | `src/tests/data/apiData/<module>.ts` | Payloads and endpoint-related data for API tests. |
| **Types** | `src/types/<module>.types.ts` | TypeScript interfaces/types for that module (form data, API response, etc.). |
| **Assertions** | `src/utils/assertions/<module>Assertions.ts` | Custom assertion helpers (e.g. `assertLoginSuccess`, `assertPimRecordVisible`). Use Playwright `expect` inside. |
| **Selectors (if new)** | `src/constants/selectors/` | Shared selector constants used by POMs (e.g. button IDs, data-testid). |

### Step 3 — Conventions to follow

- **Feature files**
  - Use business language; avoid technical locators in Gherkin.
  - Example: `Given I am on the login page` not `Given I open "/auth/login"`.
- **Step definitions**
  - Import Page Objects and assertion helpers; delegate all UI/API actions to them.
  - Use `getEnv()` for base URL and config (from `src/helpers/env/getEnv.ts`).
- **Page Objects**
  - Accept `page` (Playwright) in constructor; expose methods like `goto()`, `fillUsername()`, `clickSubmit()`.
  - Use locators from `src/constants/selectors/` or `src/utils/locator/wrapperLocator.ts` when applicable.
- **Test data**
  - No hardcoded credentials in code; use `src/tests/data/<module>.ts` or env (e.g. `getEnv('USERNAME')`).
- **Assertions**
  - One file per module: `<module>Assertions.ts`; export functions that take needed context (e.g. `page`, response) and perform `expect` calls.

### Step 4 — If the scenario is API-only

- Put **API payload/endpoint data** in `src/tests/data/apiData/<module>.ts`.
- Use **API helpers** from `src/utils/api/apiMethods.ts` (GET/POST/PUT) in step definitions.
- Optionally add **types** in `src/types/<module>.types.ts` for request/response.
- Step definitions can live in the same `src/steps/<module>.steps.ts` or a dedicated `src/steps/api.<module>.steps.ts` as per your convention.

### Step 5 — If the scenario is UI + API (e.g. login via API then UI check)

- Combine: use API data from `src/tests/data/apiData/`, API methods from `src/utils/api/`, and UI steps using POMs and `src/utils/assertions/`.

---

## 3. Example prompt you can give to the generator

Copy and adapt:

```
Create a test for the following scenario and place every artifact in the OrangeHRM Playwright framework structure.

Scenario: [Describe the scenario in 1–3 sentences.]

Requirements:
- Module name: [e.g. admin]
- Create/update: feature file, step definitions, page object(s), test data (UI + API if needed), types, and assertion helpers.
- Use getEnv() for base URL and environment-specific values.
- Follow the paths and naming in TEST-GENERATOR-PROMPT.md (features in src/tests/features/, steps in src/steps/, pages in src/pages/, data in src/tests/data/ and src/tests/data/apiData/, types in src/types/, assertions in src/utils/assertions/).
- Write Gherkin in business language; keep selectors and implementation inside step defs and POMs.
```

---

## 4. Quick path reference

```
src/
├── constants/selectors/          ← shared selectors
├── helpers/env/                  ← getEnv(), .env files
├── pages/                        ← POM classes
├── steps/                        ← <module>.steps.ts
├── tests/
│   ├── data/
│   │   ├── apiData/              ← apiData/<module>.ts
│   │   ├── <module>.ts           ← UI test data
│   └── features/                 ← <module>.feature
├── types/                        ← <module>.types.ts
└── utils/
    ├── api/apiMethods.ts         ← GET/POST/PUT
    ├── assertions/               ← <module>Assertions.ts
    └── locator/wrapperLocator.ts ← locator helpers
```

---

## 5. Checklist before considering the test “done”

- [ ] Feature file exists/updated in `src/tests/features/<module>.feature` with clear scenarios.
- [ ] Step definitions in `src/steps/` implement every step used in the feature.
- [ ] Page Object(s) in `src/pages/` with no assertions (only actions and locators).
- [ ] UI test data in `src/tests/data/<module>.ts`; API data in `src/tests/data/apiData/<module>.ts` if needed.
- [ ] Types in `src/types/<module>.types.ts` where applicable.
- [ ] Custom assertions in `src/utils/assertions/<module>Assertions.ts`; step defs use them instead of inline `expect`.
- [ ] No hardcoded URLs/credentials; use `getEnv()` or data files.
- [ ] Hooks/World in `src/helpers/hooks/` are used if the scenario needs shared setup (e.g. login state).

Use this prompt so that every generated test fits the full framework structure and stays maintainable.
