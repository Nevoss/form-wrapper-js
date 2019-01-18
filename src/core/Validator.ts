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

/**
 * Validator Class
 */
export class Validator {
  /**
   * Holds all the rules
   */
  public $rules: RulesStack = {}

  /**
   * Holds the current field that the validator is validating
   */
  public $validating: FieldKeysCollection

  /**
   * Validations options
   */
  public $options: ValidationOptions

  /**
   * constructor
   *
   * @param rules
   * @param options
   */
  constructor(rules: Object, options: ValidationOptions) {
    this.$options = { ...options }
    this.$validating = new FieldKeysCollection()

    this._buildRules(rules)
  }

  /**
   * check if field has rules
   *
   * @param fieldKey
   */
  public has(fieldKey: string): boolean {
    return this.$rules.hasOwnProperty(fieldKey)
  }

  /**
   * get the rules of specific filedKey
   *
   * @param fieldKey
   */
  public get(fieldKey: string): Rule[] {
    return this.$rules[fieldKey]
  }

  /**
   * validate specific field.
   *
   * @param field
   * @param form
   */
  public async validateField(field: Field, form: Form): Promise<any> {
    const { key } = field

    if (!this.has(key)) {
      return Promise.resolve()
    }

    const messages: string[] = []
    let fieldRulesChain: Rule[] = Array.from(this.get(key))

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

        if (this.$options.stopAfterFirstRuleFailed) {
          fieldRulesChain = []
        }
      }
    }

    this.$validating.unset(key)

    return messages.length
      ? Promise.reject(new FieldValidationError(messages))
      : Promise.resolve(field)
  }

  /**
   * building rules object
   *
   * @param rules
   * @private
   */
  private _buildRules(rules: Object): Validator {
    let defaultMessage: MessageFunction = generateMessageFunction(
      this.$options.defaultMessage
    )

    Object.keys(rules).forEach(key => {
      this.$rules[key] = rules[key].map(rawValue =>
        Rule.buildFromRawValue(rawValue, defaultMessage)
      )
    })

    return this
  }
}
