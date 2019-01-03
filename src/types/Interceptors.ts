import { InterceptorManager } from '../core/InterceptorManager'
import { Form } from '../core/Form'

/**
 * an object that hold 2 function one for fulfill and one for reject
 */
export interface InterceptorHandler {
  fulfilled: Function
  rejected: Function
}

/**
 * an object that hold only InterceptorManagers as value
 */
export interface InterceptorManagersObject {
  beforeSubmission: InterceptorManager
  submissionComplete: InterceptorManager
  [key: string]: InterceptorManager
}

/**
 * The interface of an object with successful response from the
 * SubmitCallback function
 */
export interface successfulResponse {
  form: Form
  response: any
}

/**
 * The interface of an object with unsuccessful response from the
 * SubmitCallback function
 */
export interface InvalidResponse {
  form: Form
  error: any
}
