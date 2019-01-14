import { RawRule } from '../types/Validator'
import { MessageFunction, PassesFunction } from '../types/Errors'
import generateMessageFunction from '../helpers/generateMessageFunction'
import generatePassesFunction from '../helpers/generatePassesFunction'
import { isRawRule } from '../utils'

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
   * building a Rule class from a raw value (RawRule interface of regular function)
   *
   * @param rawValue
   * @param defaultMessage
   */
  public static buildFromRawValue(
    rawValue: RawRule | Function,
    defaultMessage: MessageFunction
  ): Rule {
    // By purpose there is no type for this variable because there is a problem with the implementation later .
    // TypeScript cannot trust that if the "user" set `returnsPromise` = true the `passes` property actually return Promise,
    // But I must trust the user :) so...
    let passes
    let message: MessageFunction

    if (isRawRule(rawValue)) {
      passes = rawValue.returnsPromise
        ? rawValue.passes
        : generatePassesFunction(rawValue.passes)
      message = rawValue.message
        ? generateMessageFunction(rawValue.message)
        : defaultMessage
    } else {
      passes = generatePassesFunction(rawValue)
      message = defaultMessage
    }

    return new Rule(passes, message, rawValue)
  }
}
