🎯 Objective

I have an existing automation framework built using:

Playwright (UI + API)

Cucumber (BDD)

TypeScript

POM (Page Object Model)

Custom hooks & world

Custom reporting (JSON → HTML → JUnit)

Bitbucket pipeline integration

I want to convert this into a Hybrid Framework that:

✅ Continues supporting BDD (Cucumber)

✅ Adds TDD support using Playwright Test Runner

✅ Shares the same:

Page Objects

Utilities

API layer

Assertions

Environment configuration

Logging

✅ Supports running:

Only BDD tests

Only TDD tests

Both together

✅ Maintains reporting for both layers

🏗 Current Framework Structure

(Existing structure)

OrangeHRM-project/
│
├── src/
│   ├── constants/
│   ├── helpers/
│   │   ├── browsers/
│   │   ├── config/
│   │   ├── env/
│   │   ├── reports/
│   │   ├── setupLogin/
│   │   └── hooks/
│   ├── pages/
│   ├── stepDefinitions/
│   ├── tests/
│   │   ├── data/
│   │   └── features/
│   ├── types/
│   └── utils/
│
├── test-results/
├── convert-cucumber-to-junit.mjs
├── package.json
├── tsconfig.json

Architecture Flow:

Feature Files → Step Definitions → POM → Utilities → Browser Layer → Reports
🔥 Migration Requirements

Generate a complete hybrid architecture design including:

1️⃣ Updated Folder Structure

create a clean seperate  scalable structure for tdd like (old bdd structure do not impact):

src/
 ├── bdd/
 │   ├── features/
 │   ├── stepDefinitions/
 │   └── hooks/
 │
 ├── tdd/
 │   └── specs/              # Playwright test runner specs


Explain:

What moves where

What stays shared

What gets deleted

What gets renamed

2️⃣ Playwright Test Runner Setup (TDD Layer)

Generate:

✅ playwright.config.ts

Include:

multi-browser config

baseURL from env

storageState

retries

parallel execution

reporter config

testDir pointing to src/ui/tdd/specs

✅ Custom Fixtures

Convert:

Cucumber world

Browser setup

Auth handling

Environment handling

Into:

import { test as base } from '@playwright/test';

export const test = base.extend<{
  loginPage: LoginPage;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  }
});

Explain:

How Cucumber world maps to Playwright fixtures

How Before/After hooks map to:

test.beforeAll

test.beforeEach

test.afterEach

test.afterAll

3️⃣ Converting BDD Step Definitions → TDD Specs

Provide a conversion strategy:

Example:

BDD:

Scenario: Valid Login
  Given user navigates to login page
  When user enters valid credentials
  Then user should see dashboard

Step definition:

Given('user navigates...', async function () {
   await loginPage.navigate();
});

Convert into TDD:

test('Valid Login', async ({ loginPage }) => {
   await loginPage.navigate();
   await loginPage.login(validUser);
   await expect(dashboardPage.header).toBeVisible();
});

Explain:

How to remove glue layer

How to directly use POM

How to reuse test data

How to reuse custom assertions

4️⃣ Shared Utilities Strategy

Explain how to:

Keep utils/ fully reusable

Keep apiMethods.ts

Keep custom assertion utilities

Keep wrapper locator utility

Keep date/random/logger utilities

Ensure:

No duplication between BDD and TDD

Same source of truth

5️⃣ Reporting Strategy (Hybrid)

Currently:
Cucumber JSON → HTML → JUnit

Now also support:

Playwright reporters:

HTML

JUnit

Allure (optional)

JSON

Design:

test-results/
   ├── cucumber/
   ├── playwright/

Explain:

Separate outputs

Combined CI reporting

How to merge JUnit outputs

6️⃣ Authentication Strategy (Storage State)

Currently:
helpers/setupLogin/auth/user.json

Convert to Playwright approach:

globalSetup.ts

Save storageState

Reuse in config

Provide sample implementation.

7️⃣ Environment Handling

Current:

helpers/env/
  ├── .env
  ├── env.ts
  └── getEnv.ts

Integrate with:

import dotenv from 'dotenv';
dotenv.config();

Ensure:

Both BDD and TDD use same env

No duplication

8️⃣ API Testing Strategy

Currently:
Playwright API via utils/apiMethods.ts

Explain:

How to use request fixture in TDD

How to keep reusable API layer

How to combine UI + API in same test

9️⃣ Execution Strategy

Add scripts:

"scripts": {
   "test:bdd": "cucumber-js",
   "test:tdd": "playwright test",
   "test:all": "npm run test:bdd && npm run test:tdd"
}

Explain:

Parallel execution

Tag-based execution

CI pipeline updates

🔟 CI/CD (Bitbucket)

Explain how to:

Run both layers

Store artifacts

Publish reports

Fail build properly

⚙️ Deliverables Required From You

Generate:

📁 Final hybrid folder structure

📄 playwright.config.ts (complete example)

📄 example fixture file

📄 example converted TDD test

📄 globalSetup.ts example

📄 updated package.json scripts

📊 reporting strategy

📐 architectural comparison (Before vs After)

🚀 Best practices for hybrid maintenance

🧠 Scaling strategy for large enterprise teams

🚨 Constraints

Must follow SOLID principles

Must maintain POM

Must avoid duplication

Must keep TypeScript strict mode

Must support multi-environment

Must support API + UI

Must be CI friendly

Must be enterprise scalable

Do not change the bdd framework, treat this as new seperate implementation for tdd with reusable exisitng setup of bdd

🎯 Expected Outcome

A clean, scalable, enterprise-ready Hybrid Automation Framework:

BDD Layer (Cucumber)
TDD Layer (Playwright Test)
Shared Core (POM + Utilities)
Unified Reporting
CI Integrated


ITERATE IT UNITLL EVERYTHING WORKS AND FIXES