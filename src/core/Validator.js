import { isObject } from "../utils";

export class Validator {

  /**
   * fields rules
   *
   * @type {{}}
   */
  $rules = {}

  /**
   * validations options
   *
   * @type {{}}
   */
  $options = {}

  /**
   * constructor
   *
   * @param rules
   * @param options
   */
  constructor(rules, options) {
    this.$options = Object.assign({}, options)

    this._buildRules(rules)
  }

  /**
   * building rules object
   *
   * @param rules
   * @private
   */
  _buildRules(rules) {
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
   * @returns {boolean}
   */
  has(fieldKey) {
    return this.$rules.hasOwnProperty(fieldKey)
  }

  /**
   * get the rules of specific filedKey
   *
   * @param fieldKey
   * @returns {*}
   */
  get(fieldKey) {
    return this.$rules[fieldKey]
  }

  /**
   * validate specific field.
   *
   * @param fieldObj
   * @param form
   * @returns {*}
   */
  validateField(fieldObj, form) {
    const { key } = fieldObj

    if (!this.has(key)) {
      return []
    }

    return this.get(key)
      .filter(fieldRules => !fieldRules.passes(fieldObj, form))
      .map(fieldRules => fieldRules.message(fieldObj, form))
  }
}
