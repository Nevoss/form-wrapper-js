import { RawRule } from '../types/Validator'
import { MessageFunction, PassesFunction } from '../types/Errors'
import generateMessageFunction from '../helpers/generateMessageFunction'
import { isBoolean, isPromise, isRawRule } from '../utils'
import { Field } from '../types/Field'
import { Form } from './Form'
import { RuleValidationError } from '../errors/RuleValidationError'

export class Rule {
  /**
   * Holds the raw value before it converted to Rule
   */
  public $rawValue: RawRule | Function

  /**
   * Holds PassesFunction - the main function of the class
   */
  public passes: PassesFunction

  /**
   * Holds MessageFunction - the error message of the class
   */
  public message: MessageFunction

  /**
   * Constructor of Rule Class
   *
   * @param passes
   * @param message
   * @param rawValue
   */
  constructor(
    passes: PassesFunction,
    message: MessageFunction,
    rawValue?: RawRule | Function
  ) {
    this.passes = passes
    this.message = message
    this.$rawValue = rawValue
  }

  /**
   * validate field with passes function
   *
   * @param field
   * @param form
   */
  public validate(field: Field, form: Form): Promise<any> {
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

  /**
   * building a Rule class from a raw value (RawRule interface of regular function)
   *
   * @param rawValue
   * @param defaultMessage
   */
  public static buildFromRawValue(
    rawValue: RawRule | PassesFunction,
    defaultMessage: MessageFunction
  ): Rule {
    let passes: PassesFunction
    let message: MessageFunction

    if (isRawRule(rawValue)) {
      passes = rawValue.passes
      message = rawValue.message
        ? generateMessageFunction(rawValue.message)
        : defaultMessage
    } else {
      passes = rawValue
      message = defaultMessage
    }

    return new Rule(passes, message, rawValue)
  }
}
