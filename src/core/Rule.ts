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
   */
  public validate(field: Field, form: FormWithFields): Promise<any> {
    const passesResponse = this.passes(field, form)

    if (isBoolean(passesResponse)) {
      return passesResponse
        ? Promise.resolve()
        : Promise.reject(new RuleValidationError())
    }

    if (isPromise(passesResponse)) {
      return passesResponse
    }

    return passesResponse
      ? Promise.resolve()
      : Promise.reject(new RuleValidationError())
  }
}
