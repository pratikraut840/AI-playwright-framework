@login @smoke
Feature: OrangeHRM Login Authentication & Access Management
  As a registered user, I want to log in with valid credentials so that I can access the dashboard.

  Scenario: Successful login and dashboard access
    Given user is on login page
    When user enters valid username & password
    And clicks Login
    Then user should be redirected to Dashboard
    And dashboard header should be visible

  @regression
  Scenario: Login denied with valid username and invalid password
    Given user is on login page
    When user enters a valid username and an invalid password
    And clicks Login
    Then login should be denied
    And an invalid credentials error should be displayed

  @regression
  Scenario: Login denied with invalid username and any password
    Given user is on login page
    When user enters an invalid username and any password
    And clicks Login
    Then login should be denied
    And an invalid credentials error should be displayed

  @regression
  Scenario: Login denied with both username and password incorrect
    Given user is on login page
    When user enters both username and password incorrectly
    And clicks Login
    Then login should be denied
    And an invalid credentials error should be displayed

  @regression
  Scenario: Login denied when both username and password fields are empty
    Given user is on login page
    When user submits the login form without entering any credentials
    Then login should be denied
    And a required error should be displayed for the username field
    And a required error should be displayed for the password field

  @regression
  Scenario: Login succeeds with username entered in mixed casing
    Given user is on login page
    When user enters valid username in mixed casing with the correct password
    And clicks Login
    Then user should be redirected to Dashboard
    And dashboard header should be visible

  @regression
  Scenario: Login denied when password contains leading and trailing spaces
    Given user is on login page
    When user enters valid username and password with leading and trailing spaces
    And clicks Login
    Then login should be denied
    And an invalid credentials error should be displayed

  @regression
  Scenario: Login succeeds with a password containing special characters
    Given user is on login page
    When user enters valid username and a password with special characters
    And clicks Login
    Then user should be redirected to Dashboard
    And dashboard header should be visible
