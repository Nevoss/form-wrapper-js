/**
 * Default options that provide to Form instance
 */
import {Options} from "./types";

const defaults: Options = {
  successfulSubmission: {
    clearErrors: true,
    resetData: true,
  },
  validation: {
    stopAfterFirstRuleFailed: true,
    onSubmission: true,
    defaultMessage: ({ label }) => `${label} is invalid.`
  }
}

export default defaults
