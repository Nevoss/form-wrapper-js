/**
 * Rule Validation error
 * the reason for this error is to catch this error in the validation chain
 * and let all other errors bubble up
 */
export class RuleValidationError extends Error {}
