/**
 * Selectors for Admin > User Management module.
 * Validated via Playwright MCP against the live OrangeHRM demo.
 */
export const ADMIN_SELECTORS = {
  // ─── Common ───────────────────────────────────────────────────────────────
  /** Inline validation spans (same class as login module) */
  fieldError: '.oxd-input-field-error-message',

  // ─── System Users list page ───────────────────────────────────────────────
  list: {
    heading: 'h5:has-text("System Users")',
    addButton: 'button:has-text("Add")',
    searchButton: 'button:has-text("Search")',
    resetButton: 'button:has-text("Reset")',
    /** Element containing "(N) Records Found" text */
    recordsCount: '.orangehrm-horizontal-padding',
    /**
     * OrangeHRM renders the table as <div role="table"> not <table>.
     * Body rows are [role="row"] that contain [role="cell"] children.
     */
    tableRows: '[role="row"]:has([role="cell"])',
    /**
     * Status is the 5th [role="cell"] per column order:
     * checkbox(1), username(2), role(3), employee(4), status(5), actions(6)
     */
    statusCells: '[role="row"]:has([role="cell"]) [role="cell"]:nth-child(5)',
  },

  // ─── Add / Edit User form ─────────────────────────────────────────────────
  form: {
    heading: 'h6:has-text("Add User")',
    saveButton: 'button:has-text("Save")',
    cancelButton: 'button:has-text("Cancel")',
    employeeNameInput: 'input[placeholder="Type for hints..."]',
    /** Autocomplete suggestion options */
    employeeDropdownOption: '[role="option"]',
    /** Password strength chip: text is "Weak" | "Better" | "Strong" */
    passwordStrength: '.orangehrm-password-chip',
  },
} as const;
