/**
 * UI test data for Login module.
 * Credentials should come from env (getEnv) at runtime; these are defaults/labels only.
 */
export const loginTestData = {
  /** Expected dashboard page path after successful login */
  dashboardPath: '/web/index.php/dashboard/index',
  /** Dashboard page title fragment */
  dashboardTitleFragment: 'Dashboard',
  /** Login page path */
  loginPath: '/web/index.php/auth/login',
  /** Labels for assertions */
  labels: {
    dashboardHeader: 'Dashboard',
  },
} as const;
