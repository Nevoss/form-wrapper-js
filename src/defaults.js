/**
 * Default options that provide to Form instance
 */
export default {

  successfulSubmission: {
    clearErrors: true,
    resetData: true,
  },

  validation: {
    onSubmission: true,
    defaultMessage: ({ label }) => `${label} is invalid.`
  }
}
