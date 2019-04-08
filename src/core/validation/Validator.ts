import { Form } from '../Form'
import { Rule } from './Rule'
import { FieldKeysCollection } from '../FieldKeysCollection'
import { RuleValidationError } from '../../errors/RuleValidationError'
import { FieldValidationError } from '../../errors/FieldValidationError'
import { Field } from '../../types/Field'
import { ValidationOptions } from '../../types/Options'

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
   * Validator constructor.
   *
   * @param options
   */
  constructor(options: ValidationOptions) {
    this._options = { ...options }
    this.$validating = new FieldKeysCollection()
  }

  /**
   * validate specific field.
   *
   * @param rules
   * @param field
   * @param form
   */
  public async validateField(
    rules: Rule[],
    field: Field,
    form: Form
  ): Promise<any> {
    const { key } = field

    const messages: string[] = []
    let fieldRulesChain: Rule[] = Array.from(rules)

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
