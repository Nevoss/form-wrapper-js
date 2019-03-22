import { RawRule, RulesStack } from '../types/Validator'
import { Rule } from './Rule'
import { ValidationOptions } from '../types/Options'
import generateMessageFunction from '../helpers/generateMessageFunction'
import { MessageFunction, PassesFunction } from '../types/Errors'

export class RulesManager {
  /**
   * All the fields Rules.
   */
  private _rules: RulesStack = {}

  /**
   * Default message for the rules
   */
  private readonly _defaultMessage: MessageFunction

  /**
   * constructor
   *
   * @param rules
   * @param defaultMessage
   */
  constructor(rules: Object, defaultMessage: MessageFunction | string) {
    this._defaultMessage = generateMessageFunction(defaultMessage)
    this._buildRules(rules)
  }

  /**
   * check if field has rules
   *
   * @param fieldKey
   */
  public has(fieldKey: string): boolean {
    return this._rules.hasOwnProperty(fieldKey)
  }

  /**
   * get the rules of specific filedKey
   *
   * @param fieldKey
   */
  public get(fieldKey: string): Rule[] {
    return this._rules[fieldKey]
  }

  /**
   * return the whole fields rules
   */
  public all(): RulesStack {
    return this._rules
  }

  /**
   * Building a field rules from array of RawRules or PassesFunctions
   *
   * @param fieldKey
   * @param rawRules
   */
  public buildFieldRules(
    fieldKey: string,
    rawRules: Array<RawRule | PassesFunction>
  ) {
    this._rules[fieldKey] = rawRules.map(rawValue =>
      Rule.buildFromRawValue(rawValue, this._defaultMessage)
    )
  }

  /**
   * building rules object
   *
   * @param rules
   * @private
   */
  private _buildRules(rules: Object): RulesManager {
    Object.keys(rules).forEach(fieldKey => {
      this.buildFieldRules(fieldKey, rules[fieldKey])
    })

    return this
  }
}
