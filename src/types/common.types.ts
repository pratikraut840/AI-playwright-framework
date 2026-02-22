/**
 * Common TypeScript interfaces and types shared across all modules.
 */

import type { SupportedBrowser } from '../helpers/browsers/browserSetup';
import type { Environment } from '../constants/global';

// ─── API ─────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data: T;
  status?: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

// ─── Environment / Config ─────────────────────────────────────────────────────

export interface FrameworkConfig {
  baseUrl: string;
  username: string;
  password: string;
  browser: SupportedBrowser;
  environment: Environment;
  headless: boolean;
}

// ─── Test context ─────────────────────────────────────────────────────────────

export interface ScenarioContext {
  scenarioName: string;
  tags: string[];
  startTime: Date;
}

export interface StepResult {
  step: string;
  status: 'passed' | 'failed' | 'skipped' | 'pending';
  duration?: number;
  error?: string;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
