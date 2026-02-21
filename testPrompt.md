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

Create a test for the following scenario and place every artifact in the OrangeHRM Playwright framework structure.
Module: OrangeHRM – Login Authentication & Access Management
Type: UI only
Scenario: As a registered user, I want to log in with valid credentials so that I can access the dashboard.
Acceptance Criteria:
URL: https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
Given user is on login page
When user enters valid username & password
And clicks Login
Then user should be redirected to Dashboard
And dashboard header should be visible
