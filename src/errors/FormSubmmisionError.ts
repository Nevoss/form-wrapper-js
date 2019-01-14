import { Form } from '../core/Form'

export class FormSubmmisionError extends Error {
  /**
   * Form class
   */
  public form: Form

  /**
   * The error that was returns from the submission
   */
  public error: any
}
