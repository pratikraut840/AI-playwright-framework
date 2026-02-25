# Allure Reporting

Allure report generation is handled by `src/ui/helpers/reports/report.ts`.

## Prerequisites

- **Java** must be installed (Allure CLI requires JRE 8+).

## Commands

| Command | Description |
|--------|-------------|
| `npm run allure:generate` | Generate unified Allure report (BDD + TDD + API) → `allure-report/unified/` |
| `npm run allure:serve` | Generate and open unified report in browser |
| `npm run allure:open` | Open existing unified report |
| `npm run allure:api:generate` | Generate API-only report → `allure-report/api/` |
| `npm run allure:api:serve` | Generate and open API-only report |

## Folder Layout

```
allure-report/
├── results/
│   ├── bdd/       # Raw BDD (Cucumber) results
│   ├── tdd/       # Raw TDD (Playwright) results
│   └── api-raw/   # Raw API results
├── unified/       # Combined BDD + TDD + API report
└── api/           # API-only report
```

## Flow

1. Run tests: `npm run test:bdd`, `npm run test:tdd`, and/or `npm run test:api`
2. Allure raw data is written to `allure-report/results/bdd/`, `allure-report/results/tdd/`, and `allure-report/results/api-raw/`
3. Run `npm run allure:generate` or `npm run allure:serve` to view the unified report
