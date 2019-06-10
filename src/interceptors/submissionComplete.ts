import { InvalidResponse, SuccessfulResponse } from '../types/interceptors'

/**
 * set the $submitting property as false event if the submission
 * was successful or not
 */
export const setSubmittingToFalse = {
  fulfilled: (response: SuccessfulResponse): Promise<any> => {
    response.form.$submitting = false

    return Promise.resolve(response)
  },
  rejected: (error: InvalidResponse): Promise<any> => {
    error.form.$submitting = false

    return Promise.reject(error)
  },
}

/**
 * clear the form (errors, touched and values) base on the options
 * that was set at the form.
 */
export const clearForm = {
  fulfilled: (response: SuccessfulResponse): Promise<any> => {
    const { form } = response

    form.$options.successfulSubmission.clearErrors && form.$errors.clear()
    form.$options.successfulSubmission.clearTouched && form.$touched.clear()
    form.$options.successfulSubmission.resetValues && form.$resetValues()

    return Promise.resolve(response)
  },
  rejected: null,
}

/**
 * NOTE IMPORTANT!
 * The order of the interceptors will be from the FIRST to the last
 */
export default [setSubmittingToFalse, clearForm]
