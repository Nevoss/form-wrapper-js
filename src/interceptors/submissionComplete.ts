import { Form } from '../core/Form'
import { InterceptorHandler } from '../types'

/**
 * The interface of an object with successful response from the
 * SubmitCallback function
 */
interface successfulResponse {
  form: Form
  response: any
}

/**
 * The interface of an object with unsuccessful response from the
 * SubmitCallback function
 */
interface InvalidResponse {
  form: Form
  error: any
}

/**
 * set the $submitting property as false event if the submission
 * was successful or not
 */
export const setSubmittingAsFalse: InterceptorHandler = {
  fulfilled: (response: successfulResponse) => {
    response.form.$submitting = false

    return Promise.resolve(response)
  },
  rejected: (error: InvalidResponse) => {
    error.form.$submitting = false

    return Promise.reject(error)
  },
}

/**
 * clear the form (errors, touched and values) base on the options
 * that was set at the form.
 */
export const clearForm: InterceptorHandler = {
  fulfilled: (response: successfulResponse) => {
    const { form } = response

    form.$options.successfulSubmission.clearErrors && form.$errors.clear()
    form.$options.successfulSubmission.clearTouched && form.$touched.clear()
    form.$options.successfulSubmission.resetValues && form.resetValues()

    return Promise.resolve(response)
  },
  rejected: null,
}

/**
 * the order of the interceptors will be from the FIRST to the last
 */
export default [setSubmittingAsFalse, clearForm]
