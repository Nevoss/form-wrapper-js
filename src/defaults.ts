/**
 * Default options that provide to Form instance
 */
import {Options} from "./types";

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
    clearFieldErrorsOnFieldChange: false,
    stopAfterFirstRuleFailed: true,
    defaultMessage: ({ label }) => `${label} is invalid.`
  }
}

export default defaults
