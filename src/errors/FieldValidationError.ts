/**
 * Field validation error
 * the reason for this error is to let Form class catch the field validation
 * error and let all other errors bubble up
 */
export class FieldValidationError extends Error {
  /**
   * holds all the errors message
   */
  messages: string[]

  /**
   * Field Validation Error constructor
   *
   * @param messages
   */
  constructor(messages: string[] = []) {
    super()
    this.messages = messages
  }
}
