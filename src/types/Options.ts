import { MessageFunction } from './Errors'

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
   * the debounce time (on milliseconds) for `debounceValidateField` method.
   * `debounceValidateField` method will be called on `fieldChanged` method.
   * if `validation.onFieldChanged` option equals to true
   */
  debouncedValidateFieldTime?: number

  /**
   * validate the field on field blurred
   */
  onFieldBlurred?: boolean

  /**
   * should or not should validate the form on submission
   */
  onSubmission?: boolean

  /**
   * on "fieldChanged" call, the errors of the field will be removed
   */
  unsetFieldErrorsOnFieldChange?: boolean

  /**
   * It will stop the chain of a field validation when one rule of the
   * validation chain will failed.
   */
  stopAfterFirstRuleFailed?: boolean

  /**
   * Default message for errors
   */
  defaultMessage?: MessageFunction | string
}

/**
 * Form general Options
 */
export interface Options {
  successfulSubmission?: SuccessfulSubmissionOptions
  validation?: ValidationOptions
}
