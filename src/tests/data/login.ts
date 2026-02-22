/**
 * UI test data for Login module.
 * Credentials should come from env (getEnv) at runtime; these are defaults/labels only.
 */
export const LOGIN_TEST_DATA = {
  dashboardPath: '/web/index.php/dashboard/index',
  dashboardTitleFragment: 'Dashboard',
  loginPath: '/web/index.php/auth/login',
  labels: {
    dashboardHeader: 'Dashboard',
  },
  invalidCredentials: {
    username: 'invalidUser_test',
    password: 'wrongPassword_test',
  },
  errorMessages: {
    invalidCredentials: 'Invalid credentials',
    requiredField: 'Required',
  },
  /**
   * MCP-validated: OrangeHRM uses case-insensitive username matching.
   * Any casing variant of "Admin" resolves to a valid account.
   */
  mixedCaseUsername: 'aDmIn',
} as const;
