/**
 * Global UI labels and constants shared across all modules.
 * Use these in assertions, test data, and step definitions.
 */

export const TIMEOUTS = {
  short: 5_000,
  default: 10_000,
  long: 30_000,
  navigation: 60_000,
} as const;

export const PAGE_TITLES = {
  login: 'OrangeHRM',
  dashboard: 'Dashboard',
  pim: 'PIM',
  admin: 'Admin',
} as const;

export const NAV_LABELS = {
  dashboard: 'Dashboard',
  pim: 'PIM',
  admin: 'Admin',
  leave: 'Leave',
  time: 'Time',
  recruitment: 'Recruitment',
  myInfo: 'My Info',
  performance: 'Performance',
  reports: 'Reports',
} as const;

export const BUTTON_LABELS = {
  login: 'Login',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  search: 'Search',
  reset: 'Reset',
  add: 'Add',
  edit: 'Edit',
} as const;

export const STATUS_LABELS = {
  success: 'Successfully',
  saved: 'Successfully Saved',
  deleted: 'Successfully Deleted',
  updated: 'Successfully Updated',
} as const;

export const ENVIRONMENTS = {
  dev: 'dev',
  qa: 'qa',
  stage: 'stage',
} as const;

export type Environment = (typeof ENVIRONMENTS)[keyof typeof ENVIRONMENTS];
