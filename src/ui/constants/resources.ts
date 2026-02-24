/**
 * API endpoint constants for OrangeHRM REST API.
 * Combine with ENV.baseUrl to form full URLs.
 * Usage: `${ENV.baseUrl}${API.auth.login}`
 */

export const API = {
  auth: {
    login: '/web/index.php/api/v2/auth/login',
    logout: '/web/index.php/api/v2/auth/logout',
    refresh: '/web/index.php/api/v2/auth/refresh',
  },

  pim: {
    employees: '/web/index.php/api/v2/pim/employees',
    employee: (id: number) => `/web/index.php/api/v2/pim/employees/${id}`,
    employeeJobDetails: (id: number) =>
      `/web/index.php/api/v2/pim/employees/${id}/job-details`,
    employeePersonalDetails: (id: number) =>
      `/web/index.php/api/v2/pim/employees/${id}/personal-details`,
  },

  admin: {
    users: '/web/index.php/api/v2/admin/users',
    user: (id: number) => `/web/index.php/api/v2/admin/users/${id}`,
    jobTitles: '/web/index.php/api/v2/admin/job-titles',
    locations: '/web/index.php/api/v2/admin/locations',
    subunits: '/web/index.php/api/v2/admin/subunits',
  },

  leave: {
    leaveTypes: '/web/index.php/api/v2/leave/leave-types',
    leaveRequests: '/web/index.php/api/v2/leave/leave-requests',
    holidays: '/web/index.php/api/v2/leave/holidays',
  },
} as const;

export const UI_PATHS = {
  login: '/web/index.php/auth/login',
  dashboard: '/web/index.php/dashboard/index',
  pimList: '/web/index.php/pim/viewEmployeeList',
  adminUsers: '/web/index.php/admin/viewSystemUsers',
  recruitmentVacancies: '/web/index.php/recruitment/viewJobVacancy',
  recruitmentAddVacancy: '/web/index.php/recruitment/addJobVacancy',
  recruitmentApplyJobs: '/web/index.php/recruitmentApply/jobs.html',
} as const;
