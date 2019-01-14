import { Field } from './Field'
import { Form } from '../core/Form'

/**
 * Passes function is a prop in Rule Object
 */
export interface PassesFunction {
  (field?: Field, form?: Form): Promise<any>
}

/**
 * Message function is a prop in the Rule Object
 */
export interface MessageFunction {
  (field?: Field, form?: Form): string
}

/**
 * Errors Stack must be a field key with an array of strings
 */
export interface ErrorsStack {
  [fieldKey: string]: string[]
}
