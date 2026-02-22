/**
 * UI test data for Admin > User Management module.
 * All error-message strings validated via Playwright MCP against the live demo.
 */
export const ADMIN_TEST_DATA = {
  paths: {
    userManagement: '/web/index.php/admin/viewSystemUsers',
    addUser: '/web/index.php/admin/saveSystemUser',
  },

  /** A username that is guaranteed to already exist on the demo */
  existingUsername: 'Admin',

  passwords: {
    /** 3 chars — triggers "Should have at least 7 characters" */
    tooShort: 'abc',
    /** 7 chars, all lowercase, no digit — triggers "Your password must contain minimum 1 number" */
    noNumber: 'abcdefg',
    /** Valid strong password used where a passing password is needed */
    valid: 'Admin1234',
  },

  /** 41 chars — triggers "Should not exceed 40 characters" */
  maxLengthUsername: 'A'.repeat(41),

  search: {
    existingUsername: 'Admin',
    disabledStatus: 'Disabled' as const,
  },

  /** MCP-validated error messages */
  errorMessages: {
    required: 'Required',
    alreadyExists: 'Already exists',
    passwordTooShort: 'Should have at least 7 characters',
    passwordNoNumber: 'Your password must contain minimum 1 number',
    passwordsDoNotMatch: 'Passwords do not match',
    maxLengthExceeded: 'Should not exceed 40 characters',
  },
} as const;
