/**
 * Fulfilled function for interceptor
 */
import { FormWithFields } from './form'

export interface InterceptorFulfilled {
  (value?: any): Promise<any>
}

/**
 * Rejected function for interceptor
 */
export interface InterceptorRejected {
  (value?: any): any
}

/**
 * Interface for an object with successful response from the
 * SubmitCallback function
 */
export interface SuccessfulResponse {
  form: FormWithFields
  response: any
}

/**
 * Interface for an object with unsuccessful response from the
 * SubmitCallback function
 */
export interface InvalidResponse {
  form: FormWithFields
  error: any
}

/**
 * Interface for Interceptor object.
 * the idea is to intercept some processes in the form flow like:
 * beforeSubmission and submissionComplete
 */
export interface Interceptor {
  fulfilled: InterceptorFulfilled | null
  rejected: InterceptorRejected | null
}
