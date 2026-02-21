@login @smoke
Feature: OrangeHRM Login Authentication & Access Management
  As a registered user, I want to log in with valid credentials so that I can access the dashboard.

  Scenario: Successful login and dashboard access
    Given user is on login page
    When user enters valid username & password
    And clicks Login
    Then user should be redirected to Dashboard
    And dashboard header should be visible
