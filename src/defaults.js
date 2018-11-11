/**
 * Default options that provide to Form instance
 */
export default {

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
