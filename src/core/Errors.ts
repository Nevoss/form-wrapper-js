import { ErrorsStack } from '../types'

export class Errors {
  /**
   * Errors stack, holds all the form errors
   */
  $errors: ErrorsStack

  /**
   * Construct the Errors class with errors
   *
   * @param errors
   */
  constructor(errors: ErrorsStack = {}) {
    this.record(errors)
  }

  /**
   * Record errors to the ErrorsStack
   *
   * @param errors
   */
  public record(errors: ErrorsStack): Errors {
    this.$errors = {
      ...errors,
    }

    return this
  }

  /**
   * Append errors to the ErrorsStack
   *
   * @param errors
   */
  public push(errors: ErrorsStack): Errors {
    this.$errors = {
      ...this.$errors,
      ...errors,
    }

    return this
  }

  /**
   * checks if fieldKey exists in the ErrorsStack
   *
   * @param fieldKey
   */
  public has(fieldKey: string): boolean {
    return this.$errors.hasOwnProperty(fieldKey)
  }

  /**
   * Returns array of errors for specific field
   *
   * @param fieldKey
   * @param defaultValue
   */
  public get(fieldKey: string, defaultValue: any = []): string[] {
    if (!this.has(fieldKey)) {
      return defaultValue
    }

    return this.$errors[fieldKey]
  }

  /**
   * returns first error of specific field key
   *
   * @param fieldKey
   * @param defaultValue
   */
  public getFirst<T>(fieldKey: string, defaultValue: T = null): T | string {
    const errors = this.get(fieldKey)

    return errors.length <= 0 ? defaultValue : errors[0]
  }

  /**
   * Returns all the ErrorsStack
   */
  public all(): ErrorsStack {
    return this.$errors
  }

  /**
   * delete a key from ErrorsStack
   *
   * @param fieldKey
   */
  public unset(fieldKey: string): Errors {
    if (this.has(fieldKey)) {
      delete this.$errors[fieldKey]

      this.$errors = { ...this.$errors }
    }

    return this
  }

  /**
   * check if there is any error in the ErrorsStack
   */
  public any(): boolean {
    return Object.keys(this.$errors).length > 0
  }

  /**
   * Clear the ErrorsStack object
   */
  public clear(): Errors {
    this.$errors = {}

    return this
  }
}
