# Allure Report Configuration

The framework automatically injects rich metadata into every Allure report—Environment, Executor, Categories, and Trends—for professional, stakeholder-ready reports.

---

## Environment

Automatically captured system and execution context:

| Category | Properties |
|----------|------------|
| **Project** | `Project`, `Project.Version` |
| **Execution** | `Execution.Layer`, `Execution.Date`, `Execution.Mode`, `Execution.Timezone` |
| **Runtime** | `Node.Version`, `Framework`, `Language`, `Playwright.Version`, `Allure.Version` |
| **System** | `OS.Platform`, `OS.Release`, `OS.Arch`, `Host.Hostname`, `System.CPU.Count`, `System.Memory.GB` |
| **Git** | `Git.Branch`, `Git.Commit`, `Git.Repository` (from CI env or `git` CLI) |
| **Context** | `CI`, `Environment`, `Browser` |
| **API** (API layer) | `API.Base.URL`, `API.Target`, `Response.Time.Threshold` |
| **UI** (BDD/TDD) | `UI.Base.URL` |

---

## Executor

Build and pipeline metadata for traceability:

- **reportName** — Layer-specific (e.g. *Restful-Booker API — Build #1739876543*)
- **buildOrder** — Timestamp-based for trend ordering
- **buildName**, **jobName** — CI job identifiers
- **name** — `Local Machine` or `GITHUB Pipeline` / `GITLAB Pipeline` / etc.
- **type** — `local`, `github`, `gitlab`, `jenkins`, `azure`, `circleci`, `travis`, `bitbucket`
- **runDescription** — Branch • Commit • Layer • Generated timestamp
- **buildUrl** — GitHub Actions, GitLab CI, Jenkins BUILD_URL, etc.
- **reportUrl** — When `REPORT_URL` env is set

---

## Categories

Failure categorization for faster root-cause analysis:

| Category | Matches |
|----------|---------|
| API / Network Errors | Timeouts, ECONNREFUSED, fetch failed, socket hang |
| Authentication / 401 Errors | Unauthorized, token expired |
| Validation / 4xx Client Errors | 400, 403, 404, 422, validation, Bad Request |
| Server / 5xx Errors | 500, 502, 503, Internal Server Error |
| Assertion Failures | expect, assert, Expected vs received |
| Timeout / Performance | Timeout exceeded, slow, duration |
| Flaky Tests | Intermittent failures |
| Skipped Tests | Skipped status |

---

## Graphs, Timeline, and Suites

### Graphs (Trends)

Trend graphs (pass rate, duration over time, status distribution) appear on the **Overview** tab after **multiple report generations**. History is preserved automatically:

1. Run tests: `npm run test:bdd` / `test:tdd` / `test:api` (or `test:all`).
2. Generate report: `npm run allure:generate`.
3. Open report: `npm run allure:open` (or use the link from `allure:serve`).
4. **Run steps 1–3 again** (at least 2–3 times). Each run adds a column to the trend graphs.

The framework copies `allure-report/history` into the results dirs before each generate, so the next report includes previous runs. No extra config needed.

### Timeline

The **Timeline** view shows test execution order and duration (per worker). It is available in the report UI:

- **Allure 2:** Open the report → **Timeline** tab in the left sidebar or top navigation.
- Shows when each test started/ended; useful for parallel runs and slow tests.

Timeline is filled automatically from test result timestamps (Playwright and Cucumber adapters provide these). No configuration required.

### Suites

Tests are grouped by **Suites** (suite-based hierarchy):

- **TDD (Playwright):** Each spec file is a suite (e.g. `login.spec.ts` → suite *login.spec*). Controlled by `suiteTitle: true` in the allure-playwright reporter (default).
- **BDD (Cucumber):** Features and scenarios form the structure (feature → scenario).
- **API:** Each spec file is a suite.

In the report:

- **Suites** tab / **Suites** in the sidebar — list of suites and tests inside them.
- **Behaviors** (if used) — epic / feature / story from labels.

To add custom suite hierarchy (e.g. parent suite), use the Allure API in tests: `allure.suite('My Suite')`, `allure.parentSuite('Parent')`, or Gherkin tags for BDD.

---

## Trends (summary)

Pass/fail and duration trends appear after multiple runs. History is preserved between report generations:

1. `npm run test:api` (or `test:bdd` / `test:tdd`)
2. `npm run allure:generate` (or layer-specific `allure:api:generate`)
3. Repeat several times
4. Open report — trend graphs show pass rate and duration over time

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run allure:api:generate` | Generate API Allure report |
| `npm run allure:api:serve` | Generate + serve API report (opens browser) |
| `npm run allure:api:all` | Run API tests + serve report |
| `npm run allure:generate` | Generate combined BDD + TDD + API report |
| `npm run allure:serve` | Generate + serve combined report |
