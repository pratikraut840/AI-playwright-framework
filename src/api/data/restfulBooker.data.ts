/**
 * Restful-Booker API test data (payloads for create, update).
 * Auth credentials are in src/api/env/ (see API_ENV).
 */

export const CREATE_BOOKING_PAYLOAD = {
  firstname: 'John',
  lastname: 'Doe',
  totalprice: 199,
  depositpaid: true,
  bookingdates: {
    checkin: '2025-01-15',
    checkout: '2025-01-20',
  },
  additionalneeds: 'Breakfast',
};

export const UPDATE_BOOKING_PAYLOAD = {
  firstname: 'Jane',
  lastname: 'Smith',
  totalprice: 299,
  depositpaid: false,
  bookingdates: {
    checkin: '2025-02-01',
    checkout: '2025-02-05',
  },
  additionalneeds: 'Late checkout',
};

export const PARTIAL_UPDATE_PAYLOAD = {
  firstname: 'Alice',
  additionalneeds: 'Airport transfer',
};

/** Invalid payload (missing required fields) */
export const INVALID_BOOKING_PAYLOAD = {
  firstname: 'Test',
  // missing lastname, totalprice, bookingdates
};
