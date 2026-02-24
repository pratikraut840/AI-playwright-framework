/**
 * API layer public exports.
 * Use these for specs, fixtures, and external consumers.
 */

export { RestfulBookerClient } from './client/restfulBookerClient';
export { RestfulBookerClientWithReport } from './client/restfulBookerClientWithReport';
export { API_ENV } from './config/apiEnv';
export { ENDPOINTS } from './constants/endpoints';

export { BaseAPI, type BaseAPIConfig } from './base/BaseAPI';
export { RequestBuilder } from './builders/RequestBuilder';
export { ResponseValidator, validateResponse } from './validators/ResponseValidator';
export { validateSchema } from './validators/SchemaValidator';
export { AUTH_RESPONSE_SCHEMA, AUTH_TOKEN_SCHEMA } from './validators/schemas/auth.schema';
export {
  CREATE_BOOKING_RESPONSE_SCHEMA,
  GET_BOOKING_RESPONSE_SCHEMA,
  GET_BOOKING_IDS_SCHEMA,
} from './validators/schemas/booking.schema';
export { withRetry } from './utils/retry';
export { withLogging } from './interceptors/LoggingInterceptor';
export { MOCK_RESPONSES, createMockResponse } from './mocks/MockResponseBuilder';
