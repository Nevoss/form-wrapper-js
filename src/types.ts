import { Form } from './core/Form'
import { InterceptorManager } from './core/InterceptorManager'

/**
 * Field object that passes the PassesFunction and MessageFunction,
 * it used in the Validator class.
 */
export interface Field {
  key: string
  label: string
  value: any
}

/**
 * Passes function is a prop in Rule Object
 */
export interface PassesFunction {
  (field: Field, form: Form): boolean
}

/**
 * Message function is a prop in the Rule Object
 */
export interface MessageFunction {
  (field: Field, form: Form): string
}

/**
 * The Rule interface in responsible to check value of field is valid,
 * and send error message if not.
 */
export interface Rule {
  passes: PassesFunction
  message: MessageFunction
}

/**
 * Holds all the rules.
 * each key is the field which hold an array of rules
 */
export interface RulesStack {
  [fieldKey: string]: Rule[]
}

/**
 * Errors Stack must be a field key with an array of strings
 */
export interface ErrorsStack {
  [fieldKey: string]: string[]
}

/**
 * options that related to successful submission of the form
 */
export interface SuccessfulSubmissionOptions {
  /**
   * Clear errors after successful submission
   */
  clearErrors?: boolean

  /**
   * Clear all the touched array after successful submission
   */
  clearTouched?: boolean

  /**
   * Set the values to $initialValues after successful submission
   */
  resetValues?: boolean
}

/**
 * options that related to validation
 */
export interface ValidationOptions {
  /**
   * validate the field on field changed
   */
  onFieldChanged?: boolean

  /**
   * validate the field on field blurred
   */
  onFieldBlurred?: boolean

  /**
   * should or not should validate the form on submission
   */
  onSubmission?: boolean

  /**
   * when calling "fieldChanged" method the errors of the field will be removed
   */
  unsetFieldErrorsOnFieldChange?: boolean

  /**
   * when validation field with a chain of validation rules if this option assigned as true,
   * for this specific field it is stopping to validate the other rules
   */
  stopAfterFirstRuleFailed?: boolean

  /***
   * Default message for errors
   */
  defaultMessage?: MessageFunction
}

/**
 * Form general Options
 */
export interface Options {
  successfulSubmission?: SuccessfulSubmissionOptions
  validation?: ValidationOptions
}

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
