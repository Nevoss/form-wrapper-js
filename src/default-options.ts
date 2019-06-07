import { Options } from './types/options'

/**
 * Default options for a new instance of a `Form`
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
    onSubmission: true,
    debouncedValidateFieldTime: 0,
    unsetFieldErrorsOnFieldChange: false,
    stopAfterFirstRuleFailed: true,
    defaultMessage: ({ label }): string => `${label} is invalid.`,
  },
}

export default defaultOptions
