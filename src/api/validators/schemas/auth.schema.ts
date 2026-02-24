/**
 * JSON Schema for Auth API responses (ajv validation).
 */
export const AUTH_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    token: { type: 'string', minLength: 1 },
    reason: { type: 'string' },
  },
  oneOf: [
    { required: ['token'] },
    { required: ['reason'] },
  ],
  additionalProperties: true,
} as const;

export const AUTH_TOKEN_SCHEMA = {
  type: 'object',
  required: ['token'],
  properties: {
    token: { type: 'string', minLength: 1 },
  },
  additionalProperties: true,
} as const;
