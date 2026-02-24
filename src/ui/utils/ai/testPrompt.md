//UI
Generate a Playwright test for the following scenario:
1. Navigate to https://www.flipkart.com/
2. Search for 'Apple iPhone 17 Pro Max'
3. Verify the "Apple iPhone 17 Pro Max (Deep Blue, 256 GB)" in the list.
4. open this model in detail view
5. Take screeenshot and save in playwright report

//POM
Create a POM model for below seteps:
1. Navigate to https://www.flipkart.com/
2. Search for 'Apple iPhone 16 Pro Max'
3. Verify the "Apple iPhone 16 Pro Max (Black 256 GB)" in the list.
4. open this model in detail view
5. Take screeenshot and save in playwright report

//API
Generate a Playwright API test for the following scenario:
1. Define the API endpoint URL: 'https://fakestoreapi.com/products/1',
2. Send a GET request to the endpoint.
3. Verify the response status is 200.
4. Validate the response contains these keys: "d", "title', 'price", 'catedory', and
'description'.
5. Optionally validate the data types using a JSON Schema (Ajv).
6. Log the product title and price to the console.

=======================================================

Module (optional): e.g. login, pim, admin — or let the AI infer it.
Scenario: What the test should do (e.g. “Login with valid credentials and verify dashboard”).
Type (optional): UI only, API only, or UI + API.
=======================================================

Create a test for the following scenario and place every artifact in the OrangeHRM Playwright framework structure.
Module: Admin: User Management
Type: UI only

@recruitment @vacancy
Feature: Job Posting — Vacancy Management
  As an administrator, I want to create, publish, edit, and close vacancies
  so that candidates can view and apply for open positions.

  Background:
    Given admin is logged into the system
    And admin navigates to Recruitment → Vacancies

  # ─── Create Vacancy ────────────────────────────────────────────────────────

  @regression
  Scenario: Create vacancy with valid mandatory data
    When admin navigates to Add Vacancy
    And admin enters valid mandatory fields:
      | Job Title        | Vacancy Name   | Hiring Manager | Number of Positions | Description  |
      | Software Engineer| Senior Dev 2024| John Doe       | 2                   | Full-stack role |
    And admin clicks Save
    Then vacancy is created successfully
    And a success message is displayed
    And the vacancy appears in the vacancy list
    And the vacancy status is "Active"

  @regression
  Scenario: System generates unique vacancy ID on save
    Given admin has created a vacancy
    When the vacancy is saved
    Then the system auto-generates a unique vacancy identifier

  @regression
  Scenario: Vacancy is linked to selected job title
    Given multiple job titles exist in the system
    When admin creates a vacancy and selects a job title
    Then the vacancy is correctly linked to that job title
    And the vacancy appears when filtering by that job title

  @regression
  Scenario: Mandatory field validation prevents save when fields are blank
    When admin opens Add Vacancy
    And admin leaves all mandatory fields blank
    And admin clicks Save
    Then the system displays inline validation errors for mandatory fields
    And the vacancy is not created

  @regression
  Scenario Outline: Number of positions rejects invalid values
    When admin opens Add Vacancy
    And admin enters "<invalid_value>" in Number of Positions
    And admin clicks Save
    Then the system shows a validation error
    And the vacancy is not saved
    Examples:
      | invalid_value | description |
      | 0             | zero        |
      | -1            | negative    |
      | 1.5           | decimal     |
      | abc           | alphabetic  |

  @regression
  Scenario: Job Title dropdown loads active job titles
    When admin opens Add Vacancy
    Then the Job Title dropdown lists all active job titles
    And the dropdown is searchable

  @regression
  Scenario: Hiring Manager dropdown loads active employees
    When admin opens Add Vacancy
    Then the Hiring Manager dropdown lists active employees
    And the dropdown is searchable

  # ─── Publish Vacancy ──────────────────────────────────────────────────────

  @regression
  Scenario: Admin can publish a draft vacancy
    Given a vacancy exists in Draft or Active state
    When admin opens the vacancy and clicks Publish
    Then the vacancy status changes to "Published"
    And a confirmation message is displayed

  @regression
  Scenario: Published vacancy appears on public job listing
    Given a vacancy has status "Published"
    When a candidate visits the Careers or Job Listing page
    Then the vacancy appears in the public listing
    And the correct details are displayed

  @regression
  Scenario: Incomplete vacancy cannot be published
    Given a vacancy has mandatory fields missing
    When admin attempts to publish the vacancy
    Then the system prevents publishing
    And a validation error is displayed

  @regression
  Scenario: Draft vacancy is not visible on public listing
    Given a vacancy has status "Draft"
    When a candidate views the public job listing
    Then the vacancy does not appear

  # ─── Edit Vacancy ─────────────────────────────────────────────────────────

  @regression
  Scenario: Admin can edit vacancy details
    Given an existing vacancy
    When admin updates Description, Hiring Manager, and Number of Positions
    And admin clicks Save
    Then the updated data is saved
    And a success message is displayed

  @regression
  Scenario: Edit reflects in vacancy list immediately
    Given an existing vacancy
    When admin updates the vacancy and saves
    Then the vacancy list shows the updated values

  @regression
  Scenario: Mandatory fields cannot be cleared on edit
    Given an existing vacancy
    When admin clears a mandatory field and clicks Save
    Then a validation error is displayed
    And the data is not saved

  @regression
  Scenario: Invalid values are blocked on edit
    Given an existing vacancy
    When admin enters an invalid value (e.g. negative positions) and clicks Save
    Then the system blocks the save
    And a validation error is displayed

  # ─── Close Vacancy ───────────────────────────────────────────────────────

  @regression
  Scenario: Admin can close an active or published vacancy
    Given a vacancy has status "Active" or "Published"
    When admin clicks Close on the vacancy
    Then the vacancy status becomes "Closed"
    And a confirmation message is displayed

  @regression
  Scenario: Closed vacancy is removed from public listing
    Given a vacancy has status "Closed"
    When a candidate views the public job listing
    Then the vacancy is not visible

  @regression
  Scenario: Application blocked for closed vacancy
    Given a vacancy has status "Closed"
    When a candidate attempts to apply via direct URL
    Then the system shows "This vacancy is closed"
    And application submission is blocked

  @regression
  Scenario: Cannot close an already closed vacancy
    Given a vacancy has status "Closed"
    When admin attempts to close the vacancy again
    Then the Close action is disabled or an error message is shown
