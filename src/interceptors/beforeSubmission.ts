import { Form } from '../core/Form'

/**
 * validate the form before submission
 * only if the option of validation on submission set as true.
 */
export const validateForm = {
  fulfilled: async (form: Form): Promise<any> => {
    if (form.$options.validation.onSubmission) {
      await form.$validate()

      if (form.$errors.any()) {
        throw new Error('Form is invalid.')
      }
    }

    return form
  },
  rejected: null,
}

/**
 * Set the $submitting as true (this is must to be the LAST interceptor before submitting)
 */
export const setSubmittingToTrue = {
  fulfilled: async (form: Form): Promise<any> => {
    form.$submitting = true

    return form
  },
  rejected: null,
}

/**
 * NOTE IMPORTANT!
 * The order of the interceptors will be from the LAST to the first
 */
export default [validateForm, setSubmittingToTrue]
