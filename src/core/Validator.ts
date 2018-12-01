import {isObject} from "../utils";
import {Field, Rule, RulesStack, ValidationOptions} from "../types";
import {Form} from "./Form";

/**
 * Validator Class
 */
export class Validator {

  /**
   * Holds all the rules
   */
  $rules: RulesStack = {}

  /**
   * Validations options
   */
  $options: ValidationOptions

  /**
   * constructor
   *
   * @param rules
   * @param options
   */
  constructor(rules: Object, options: ValidationOptions) {
    this.$options = { ...options }

    this.buildRules(rules)
  }

  /**
   * building rules object
   *
   * @param rules
   */
  private buildRules(rules: Object): Validator {
    Object.keys(rules).forEach(key => {
      this.$rules[key] = rules[key].map(rule => {

        let passes = rule
        let message = this.$options.defaultMessage

        if (isObject(rule)) {
          passes = rule.passes
          message = rule.message
        }

        return {
          passes,
          message: typeof message === 'function' ? message : () => message
        }
      })
    })

    return this
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
  public validateField(field: Field, form: Form): string[] {
    const { key } = field

    if (!this.has(key)) {
      return []
    }

    let messages = [];

    for (let fieldRules of this.get(key)) {
      if (fieldRules.passes(field, form)) {
        continue
      }

      messages.push(fieldRules.message(field, form))

      if (this.$options.stopAfterFirstRuleFailed) {
        break
      }
    }

    return messages
  }
}
