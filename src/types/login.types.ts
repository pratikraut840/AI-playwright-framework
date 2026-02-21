/**
 * Types for Login / Authentication module.
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginPageState {
  url: string;
  title?: string;
}
