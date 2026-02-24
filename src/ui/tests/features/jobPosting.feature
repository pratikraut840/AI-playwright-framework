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
      | QA Engineer      | Senior Dev 2024| a              | 2                   | Full-stack role |
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

  # ─── Edit Vacancy ───────────────────────────────────────────────────────────
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

