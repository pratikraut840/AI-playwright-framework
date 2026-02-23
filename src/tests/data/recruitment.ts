/**
 * UI test data for Recruitment > Vacancies module.
 * Validated via Playwright MCP against the live OrangeHRM demo.
 */
export const RECRUITMENT_TEST_DATA = {
  paths: {
    vacancies: '/web/index.php/recruitment/viewJobVacancy',
    addVacancy: '/web/index.php/recruitment/addJobVacancy',
  },

  /** MCP-validated: demo has "QA Engineer" and other job titles */
  jobTitles: ['QA Engineer', 'Software Engineer'] as const,

  /** Hiring manager autocomplete - use partial name from demo employees */
  hiringManagerHint: 'a',

  form: {
    /** Valid vacancy for create flow */
    valid: {
      vacancyName: 'Senior Dev 2024',
      jobTitle: 'QA Engineer',
      hiringManager: 'a',
      numberOfPositions: 2,
      description: 'Full-stack role',
    },
    invalidPositions: ['0', '-1', '1.5', 'abc'] as const,
  },

  errorMessages: {
    required: 'Required',
    positionsRange: 'Should be a number between 1-99',
  },

  successMessage: 'Successfully Saved',
  vacancyClosedMessage: 'This vacancy is closed',
} as const;
