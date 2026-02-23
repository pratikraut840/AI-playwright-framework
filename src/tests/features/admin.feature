@admin
Feature: Admin Module - User Management
  As an administrator, I want to manage system users with proper validation,
  uniqueness enforcement, and searchability.

  Background:
    Given admin is authenticated and on the User Management list page

  @regression
  Scenario: Username uniqueness is enforced when a duplicate is submitted
    When admin opens the Add User form
    And admin enters an already-existing username in the username field
    And admin clicks Save on the user form
    Then the form should show an already-exists error for the username

  @regression
  Scenario: Password shorter than 7 characters is rejected
    When admin opens the Add User form
    And admin enters a password that is too short
    And admin clicks Save on the user form
    Then the form should show a password length validation error

  @regression
  Scenario: Password without a numeric character is rejected
    When admin opens the Add User form
    And admin enters a password with no numeric character
    And admin clicks Save on the user form
    Then the form should show a minimum numeric character error

  @regression
  Scenario: Submitting the Add User form with no data shows required errors
    When admin opens the Add User form
    And admin clicks Save on the user form
    Then the form should show required field validation errors

  @regression  @smoke
  Scenario: Searching by an existing username returns matching results
    When admin searches for users by the known username
    Then the user list should contain at least one result
    And the records count should reflect the filtered results

  @regression
  Scenario: Filtering by Disabled status shows only deactivated users
    When admin filters the user list by Disabled status
    Then all displayed users in the list should have Disabled status

  @regression
  Scenario: Username longer than 40 characters is rejected
    When admin opens the Add User form
    And admin enters a username that exceeds the maximum allowed length
    And admin clicks Save on the user form
    Then the form should show a maximum length exceeded error for the username
