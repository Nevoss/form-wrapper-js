/**
 * Default options that provide to Form instance
 */
import { Options } from './types'

const defaults: Options = {
  successfulSubmission: {
    clearErrors: true,
    clearTouched: true,
    resetData: true,
  },
  validation: {
    onFieldBlurred: false,
    onFieldChanged: false,
    onSubmission: true,
    unsetFieldErrorsOnFieldChange: false,
    stopAfterFirstRuleFailed: true,
    defaultMessage: ({ label }) => `${label} is invalid.`,
  },
}

export default defaults
