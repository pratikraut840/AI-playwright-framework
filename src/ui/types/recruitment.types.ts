/**
 * Types for Recruitment > Vacancies module.
 */
export type VacancyStatus = 'Active' | 'Draft' | 'Published' | 'Closed';

export interface VacancyFormData {
  vacancyName: string;
  jobTitle: string;
  hiringManager: string;
  numberOfPositions?: number;
  description?: string;
}
