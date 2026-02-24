/**
 * Schema Validator — JSON schema validation using ajv.
 */
import Ajv, { type ValidateFunction } from 'ajv';

const ajv = new Ajv({ allErrors: true });

export interface SchemaValidationResult {
  valid: boolean;
  errors: string[] | null;
}

/** Validate data against a JSON schema. */
export function validateSchema<T = unknown>(schema: object, data: T): SchemaValidationResult {
  const validate = ajv.compile(schema) as ValidateFunction<T>;
  const valid = validate(data);
  if (valid) {
    return { valid: true, errors: null };
  }
  const errors = (validate.errors ?? []).map(
    (e) => `${e.instancePath || '/'} ${e.message ?? ''}`.trim()
  );
  return { valid: false, errors };
}
