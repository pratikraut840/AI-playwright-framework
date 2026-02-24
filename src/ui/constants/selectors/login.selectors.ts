/**
 * Selectors for Login and Auth flows.
 */
export const LOGIN_SELECTORS = {
  usernameInput: 'input[name="username"]',
  passwordInput: 'input[name="password"]',
  loginButton: 'button[type="submit"]',
  /** Error toast shown for invalid credentials — role="alert" */
  alertMessage: '[role="alert"] p',
  /** Inline "Required" validation spans — nth(0)=username, nth(1)=password */
  fieldErrorMessage: '.oxd-input-field-error-message',
} as const;

export const DASHBOARD_SELECTORS = {
  /** Main dashboard header / breadcrumb or heading */
  header: '[class*="oxd-topbar"]',
  dashboardHeading: 'h6:has-text("Dashboard"), .oxd-topbar-header-breadcrumb, [class*="header"]',
} as const;
