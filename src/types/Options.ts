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
