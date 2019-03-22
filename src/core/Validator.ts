import { Form } from './Form'
import { Rule } from './Rule'
import { FieldKeysCollection } from './FieldKeysCollection'
import { RuleValidationError } from '../errors/RuleValidationError'
import { FieldValidationError } from '../errors/FieldValidationError'
import generateMessageFunction from '../helpers/generateMessageFunction'
import { Field } from '../types/Field'
import { RulesStack } from '../types/Validator'
import { ValidationOptions } from '../types/Options'
import { MessageFunction } from '../types/Errors'
import { RulesManager } from './RulesManager'

/**
 * Validator Class
 */
export class Validator {
  /**
   * Holds the current field that the validator is validating
   */
  public $validating: FieldKeysCollection

  /**
   * Validations options
   */
  private _options: ValidationOptions

  /**
   * Rules managers - hold all the fields rules.
   */
  private _rules: RulesManager

  /**
   * Validator constructor.
   *
   * @param rules
   * @param options
   */
  constructor(rules: RulesManager, options: ValidationOptions) {
    this._rules = rules
    this._options = { ...options }
    this.$validating = new FieldKeysCollection()
  }

  /**
   * validate specific field.
   *
   * @param field
   * @param form
   */
  public async validateField(field: Field, form: Form): Promise<any> {
    const { key } = field

    if (!this._rules.has(key)) {
      return Promise.resolve()
    }

    const messages: string[] = []
    let fieldRulesChain: Rule[] = Array.from(this._rules.get(key))

    this.$validating.push(key)

    while (fieldRulesChain.length) {
      let fieldRule = fieldRulesChain.shift()
      try {
        await fieldRule.validate(field, form)
      } catch (error) {
        if (!(error instanceof RuleValidationError)) {
          this.$validating.unset(key)

          return Promise.reject(error)
        }

        messages.push(fieldRule.message(field, form))

        if (this._options.stopAfterFirstRuleFailed) {
          fieldRulesChain = []
        }
      }
    }

    this.$validating.unset(key)

    return messages.length
      ? Promise.reject(new FieldValidationError(messages))
      : Promise.resolve(field)
  }
}
