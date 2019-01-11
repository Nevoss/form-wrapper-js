import { Options } from './types/Options'

/**
 * Default options that provide to Form instance
 */
const defaultOptions: Options = {
  successfulSubmission: {
    clearErrors: true,
    clearTouched: true,
    resetValues: true,
  },
  validation: {
    onFieldBlurred: false,
    onFieldChanged: false,
    debouncedValidateFieldTime: 0,
    onSubmission: true,
    unsetFieldErrorsOnFieldChange: false,
    stopAfterFirstRuleFailed: true,
    defaultMessage: ({ label }) => `${label} is invalid.`,
  },
}

export default defaultOptions
