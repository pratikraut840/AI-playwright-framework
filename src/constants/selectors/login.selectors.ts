/**
 * Selectors for Login and Auth flows.
 */
export const loginSelectors = {
  usernameInput: 'input[name="username"]',
  passwordInput: 'input[name="password"]',
  loginButton: 'button[type="submit"]',
} as const;

export const dashboardSelectors = {
  /** Main dashboard header / breadcrumb or heading */
  header: '[class*="oxd-topbar"]',
  dashboardHeading: 'h6:has-text("Dashboard"), .oxd-topbar-header-breadcrumb, [class*="header"]',
} as const;
