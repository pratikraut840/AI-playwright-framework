# Allure Reporting

Allure report generation is handled by `src/ui/helpers/reports/report.ts`.

## Prerequisites

- **Java** must be installed (Allure CLI requires JRE 8+).

## Commands

| Command | Description |
|--------|-------------|
| `npm run allure:generate` | Generate Allure report from BDD + TDD results → `allure-report/` |
| `npm run allure:serve` | Generate and open Allure report in browser |
| `npm run allure:open` | Open an existing generated report |

## Flow

1. Run tests: `npm run test:bdd` and/or `npm run test:tdd`
2. Allure data is written to `allure-results-bdd/` and `allure-results-tdd/`
3. Run `npm run allure:generate` or `npm run allure:serve` to view
