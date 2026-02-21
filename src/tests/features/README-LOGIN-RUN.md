# Running the Login Test

## Quick run (Playwright)

1. Install browsers (once):  
   `npx playwright install`

2. Run the login spec:  
   `npx playwright test tests/login.spec.ts`

3. Optional: run with UI or headed:  
   `npx playwright test tests/login.spec.ts --ui`  
   `npx playwright test tests/login.spec.ts --headed`

## Environment

Override via env vars or `.env`:

- `ORANGEHRM_BASE_URL` (default: https://opensource-demo.orangehrmlive.com)
- `ORANGEHRM_USERNAME` (default: Admin)
- `ORANGEHRM_PASSWORD` (default: admin123)
