import { RuleValidationError } from '../errors/RuleValidationError'
import createRule from '../factories/RuleFactory'
import { isBoolean, isPromise } from '../utils'
import {
  RuleDeclaration,
  RuleMessageFunction,
  RulePassesFunction,
} from '../types/validation'
import { Field } from '../types/fields'
import { FormWithFields } from '../types/form'

export class Rule {
  /**
   * Create Rule
   *
   * @param value
   */
  public static create(value: RuleDeclaration | RulePassesFunction): Rule {
    return createRule(value)
  }

  /**
   * Function that decide if the rule is passes or not/
   */
  public passes: RulePassesFunction

  /**
   * Function that returns the rule error message
   */
  public message: RuleMessageFunction | null

  /**
   * Rule Constructor.
   *
   * @param passes
   * @param message
   */
  public constructor(
    passes: RulePassesFunction,
    message: RuleMessageFunction | null = null
  ) {
    this.passes = passes
    this.message = message
  }

  /**
   * validate the rule
   *
   * @param field
   * @param form
   * @param defaultMessage
   */
  public validate(
    field: Field,
    form: FormWithFields,
    defaultMessage: RuleMessageFunction
  ): Promise<any> {
    const passesResponse = this.passes(field, form)

    if (isBoolean(passesResponse)) {
      return passesResponse
        ? Promise.resolve()
        : Promise.reject(
            new RuleValidationError(
              this.invokeErrorMessage(field, form, defaultMessage)
            )
          )
    }

    if (isPromise(passesResponse)) {
      return passesResponse
    }

    return passesResponse
      ? Promise.resolve()
      : Promise.reject(
          new RuleValidationError(
            this.invokeErrorMessage(field, form, defaultMessage)
          )
        )
  }

  /**
   * calls the message function or the default message function
   *
   * @param field
   * @param form
   * @param defaultMessage
   */
  public invokeErrorMessage(
    field: Field,
    form: FormWithFields,
    defaultMessage: RuleMessageFunction
  ): string {
    return this.message !== null
      ? this.message(field, form)
      : defaultMessage(field, form)
  }
}
