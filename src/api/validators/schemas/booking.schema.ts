/**
 * JSON Schema for Booking API responses (ajv validation).
 */
const bookingDatesSchema = {
  type: 'object',
  required: ['checkin', 'checkout'],
  properties: {
    checkin: { type: 'string' },
    checkout: { type: 'string' },
  },
} as const;

export const CREATE_BOOKING_RESPONSE_SCHEMA = {
  type: 'object',
  required: ['bookingid'],
  properties: {
    bookingid: { type: 'number' },
    booking: { type: 'object' },
  },
  additionalProperties: true,
} as const;

export const GET_BOOKING_RESPONSE_SCHEMA = {
  type: 'object',
  required: ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates'],
  properties: {
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    totalprice: { type: 'number' },
    depositpaid: { type: 'boolean' },
    bookingdates: bookingDatesSchema,
    additionalneeds: { type: 'string' },
  },
  additionalProperties: true,
} as const;

export const GET_BOOKING_IDS_SCHEMA = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      bookingid: { type: 'number' },
    },
  },
} as const;
