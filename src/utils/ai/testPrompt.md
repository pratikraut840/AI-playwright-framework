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

Scenario 1: Case sensitivity in usernames

Given usernames are case-sensitive
When a new user is created with a username that differs only in case (e.g., Admin vs admin)
Then the system should enforce uniqueness consistently

🔹 Scenario 2: Password policy enforcement

Given Admin creates a user
When a password does not meet complexity rules (e.g., minimum length, special characters, uppercase letters)
Then system should prevent creation and display an appropriate validation message

🔹 Scenario 3: User role validation

Given Admin assigns a role
When an invalid or undefined role is entered
Then system should reject the assignment and display a validation error

🔹 Scenario 4: Bulk user creation

Given Admin uploads multiple users via CSV or import tool
When some usernames already exist
Then system should create the valid users and display errors for duplicates


🔹 Scenario 8: Input validation

Given Admin edits a user
When an invalid email or phone number is entered
Then system should prevent saving and display an error message

🔹 Scenario 9: Audit trail verification

Given Admin creates, updates, deactivates, or deletes a user
Then the action should be recorded in the audit log
And should include old vs new values, timestamp, and admin username

🔹 Scenario 10: Search and filter functionality

Given multiple users exist
When Admin searches by name, role, or status
Then the system should display relevant users
And inactive users should be clearly labeled

🔹 Scenario 12: Maximum field length

Given Admin enters excessively long text in any field (e.g., username, email)
Then system should prevent saving and show validation errors
