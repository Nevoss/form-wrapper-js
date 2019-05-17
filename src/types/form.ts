import { Options } from './options'
import { Interceptors } from '../core/Interceptors'
import { Form } from '../core/Form'

/**
 * Static property on the `Form` class
 * that holds the default configuration of it.
 */
export interface FormDefaults {
  options: Options
  interceptors: {
    beforeSubmission: Interceptors
    submissionComplete: Interceptors
  }
}

/**
 * Submit callback interface,
 * the function the should pass to submit method in Form class
 */
export interface SubmitCallback {
  (form: Form): Promise<any>
}

export type FormWithFields = Form & { [key: string]: any }
