===========================================================
BDD Gherkin Playwright MASTER PROMPT
===========================================================

You are a Senior QA Automation Architect.

I need you to generate:
1. High-level EPIC
2. Feature files written in Gherkin (BDD format)
3. Well-structured user stories
4. Positive, negative, edge test scenarios
5. Background and reusable steps
6. Tags for test categorization (@smoke, @regression, @negative, etc.)

Context:
- Project: API Automation
- Tool: Playwright with TypeScript
- Target Application: Restful Booker (https://restful-booker.herokuapp.com/)
- Type: REST API Testing
- Framework style: BDD with Cucumber + Playwright
- Goal: Demo-ready automation framework

APIs to cover:
- Auth
- Create Booking
- Get Booking
- Update Booking (PUT)
- Partial Update (PATCH)
- Delete Booking
- Get Booking IDs
- Health Check / Ping

For each feature:
- Start with an EPIC description
- Provide User Stories in this format:

  As a <role>
  I want to <action>
  So that <benefit>

- Then generate a complete Gherkin Feature file:
  - Include Feature title
  - Include Background (if needed)
  - Include multiple scenarios:
      - Positive flow
      - Validation failures
      - Invalid authentication
      - Boundary cases
      - Data-driven examples (Scenario Outline)
      - Response time validation
      - Schema validation
  - Use realistic JSON request bodies
  - Validate:
      - Status codes
      - Response body fields
      - Headers
      - Response time threshold
      - Token usage where applicable

Also:
- Organize features logically (Auth.feature, Booking.feature, etc.)
- Follow clean BDD best practices
- Make scenarios automation-ready (clear Given/When/Then)
- Use proper API testing terminology
- Avoid UI-related steps
- Keep steps reusable for Playwright implementation

Output format:
- EPIC
- User Stories
- Feature File (Gherkin code block)
- Brief explanation of automation approach in Playwright TypeScript

Make it production-quality and demo-ready.

=============================================================
MASTER PROMPT – TDD Based (Playwright + TypeScript)
=============================================================

You are a Senior QA Automation Architect specializing in Test-Driven Development (TDD).

I want to build an API automation framework using:

- Tool: Playwright
- Language: TypeScript
- Target Application: Restful Booker (https://restful-booker.herokuapp.com/)
- Type: REST API Automation
- Framework style: Pure TDD (No Gherkin / No BDD)
- Goal: Demo-ready, production-quality API test framework

Follow STRICT TDD principles:

1. RED Phase
   - First write failing test cases
   - Clearly explain what is expected to fail and why
   - Write test specifications before implementation

2. GREEN Phase
   - Write the minimum implementation code required to pass tests
   - Keep implementation simple

3. REFACTOR Phase
   - Improve code structure
   - Extract reusable utilities
   - Improve readability
   - Apply best practices

APIs to cover:
- Auth (Create Token)
- Create Booking
- Get Booking
- Update Booking (PUT)
- Partial Update (PATCH)
- Delete Booking
- Get Booking IDs
- Health Check / Ping

For EACH API:
-------------------------------------------------------
1. Test Strategy Explanation
2. RED – Write failing Playwright test cases
3. GREEN – Provide minimal API helper implementation
4. REFACTOR – Improve structure
5. Add edge cases:
   - Invalid payload
   - Missing required fields
   - Invalid auth token
   - Boundary values
   - Response time validation
   - Schema validation
6. Include assertions for:
   - Status code
   - Response body
   - Headers
   - Response time threshold
-------------------------------------------------------

Technical Requirements:

- Use Playwright test runner (not Cucumber)
- Use request context (APIRequestContext)
- Use proper TypeScript typing
- Use reusable API client class
- Include environment config (baseURL, credentials)
- Use beforeAll / afterAll where appropriate
- Include tagging strategy (@smoke, @regression)
- Provide folder structure
- Provide sample .env usage
- Use clean architecture pattern:
    config/
    constant/
    client/
    fixtures/
    specs/
    Data/

Output format:

1. High-Level TDD Strategy
2. Folder Structure
3. RED (Failing Tests)
4. GREEN (Minimal Implementation)
5. REFACTOR (Improved Structure)
6. Final Production-Ready Version
7. Suggestions for CI integration
8. Suggestions for reporting (Allure /JUnit/ HTML)

Make it professional, structured, and demo-ready.


Additionally:
- Apply SOLID principles
- Add BaseAPI class
- Add Request Builder pattern
- Add Response Validator utility
- Add JSON schema validation using ajv
- Add retry mechanism for flaky endpoints
- Add logging interceptor
- Add performance threshold configuration
- Add parallel execution strategy
- Add mock strategy for isolated testing