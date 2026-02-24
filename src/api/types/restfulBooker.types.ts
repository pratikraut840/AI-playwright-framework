/**
 * Restful-Booker API TypeScript types.
 */

export interface AuthTokenResponse {
  token?: string;
}

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface CreateBookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface BookingResponse {
  bookingid: number;
  booking?: CreateBookingPayload;
}

export interface GetBookingResponse {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}
