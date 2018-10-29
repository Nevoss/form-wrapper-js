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
          message: message instanceof Function ? message : () => message
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
   * validate one field and returns the errors message if there is
   *
   * @param fieldKey
   * @param value
   * @returns {*}
   */
  validateField(fieldKey, value) {
    if (!this.has(fieldKey)) {
      return []
    }

    return this.get(fieldKey)
      .filter(fieldRules => !fieldRules.passes(value))
      .map(fieldRules => fieldRules.message)
  }

  /**
   * validate all the rules
   *
   * @param values
   * @returns {Object}
   */
  validate(values) {
    let errors = {}

    Object.keys(this.$rules)
      .forEach(key => {
        errors[key] = this.validateField(key, values[key])
      })

    return errors
  }

}
