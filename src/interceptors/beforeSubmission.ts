import { Form } from '../core/Form'
import { InterceptorHandler } from '../types/Interceptors'

/**
 * validate the form before submission
 * only if the option of validation on submission set as true.
 */
export const validateForm: InterceptorHandler = {
  fulfilled: (form: Form): Promise<any> => {
    if (form.$options.validation.onSubmission && !form.validate()) {
      return Promise.reject({ message: 'Form is invalid.' })
    }

    return Promise.resolve(form)
  },
  rejected: null,
}

/**
 * Set the $submitting as true (this is must to be the LAST interceptor before submitting)
 * but the FIRST here in the export array
 */
export const setSubmittingAsTrue: InterceptorHandler = {
  fulfilled: (form: Form): Promise<any> => {
    form.$submitting = true

    return Promise.resolve(form)
  },
  rejected: null,
}

/**
 * the order of the interceptors will be from the LAST to the first
 */
export default [setSubmittingAsTrue, validateForm]
