/**
 * Types for Admin > User Management module.
 */
export type UserRole = 'Admin' | 'ESS';

export type UserStatus = 'Enabled' | 'Disabled';

export interface SystemUser {
  username: string;
  userRole: UserRole;
  employeeName: string;
  status: UserStatus;
  password?: string;
}

export interface UserSearchFilters {
  username?: string;
  userRole?: UserRole;
  employeeName?: string;
  status?: UserStatus;
}

export interface UserFormValidationState {
  fieldErrors: string[];
  passwordStrength?: string;
}
