/**
 * Restful-Booker API endpoints.
 * Combine with baseUrl to form full URLs.
 */
export const ENDPOINTS = {
  auth: '/auth',
  booking: '/booking',
  bookingById: (id: number) => `/booking/${id}`,
  ping: '/ping',
} as const;
