/**
 * Selectors for Recruitment > Vacancies module.
 * Validated via Playwright MCP against the live OrangeHRM demo.
 */
export const RECRUITMENT_SELECTORS = {
  fieldError: '.oxd-input-field-error-message',

  list: {
    heading: 'h5:has-text("Vacancies")',
    addButton: 'button:has-text("Add")',
    /** OrangeHRM uses div[role=table]; rows have [role="cell"] */
    tableRows: '[role="table"] [role="row"]:has([role="cell"]), [role="row"]:has([role="cell"]), table tbody tr',
    statusCells: '[role="row"]:has([role="cell"]) [role="cell"]:nth-child(5), table tbody tr td:nth-child(5)',
  },

  addForm: {
    heading: 'h6:has-text("Add Vacancy")',
    vacancyNameInput: '.orangehrm-card-container input:not([placeholder]):not([type="checkbox"])',
    jobTitleDropdown: '.oxd-select-wrapper',
    hiringManagerInput: 'input[placeholder="Type for hints..."]',
    descriptionInput: 'input[placeholder="Type description here"], textarea',
    numberOfPositionsInput: 'input[placeholder*="umber"], input[type="number"]',
    saveButton: 'button:has-text("Save")',
    cancelButton: 'button:has-text("Cancel")',
  },

  toast: '[role="alert"]',
} as const;
