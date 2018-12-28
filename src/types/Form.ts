import { Options } from './Options'
import { InterceptorManagersObject } from './Interceptors'
import { Form } from '../core/Form'

/**
 * The defaults of the form,
 * that can be changeable and then will affect on all the new Form instances
 */
export interface FormDefaults {
  options: Options
  interceptors: InterceptorManagersObject
}

/**
 * Submit callback interface,
 * the function the should pass to submit method in Form class
 */
export interface SubmitCallback {
  (form: Form): Promise<any>
}
