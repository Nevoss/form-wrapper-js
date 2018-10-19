
export class Errors {

  /**
   * hold all the errors
   *
   * @type {Object}
   */
  $errors = {}

  /**
   * constructor
   *
   * @param errors
   */
  constructor(errors = {}) {
    this.record(errors)
  }

  /**
   * record errors in the $errors object
   *
   * @param errors
   * @returns {Errors}
   */
  record(errors) {
    this.$errors = Object.assign({}, errors)

    return this;
  }

  /**
   * returns array of errors for specific field
   *
   * @param fieldName
   * @param defaultValue
   * @returns {*}
   */
  get(fieldName, defaultValue = []) {
    if (!this.has(fieldName)) {
      return defaultValue
    }

    return this.$errors[fieldName]
  }

  /**
   * returns all the errors array
   *
   * @returns {Object}
   */
  all() {
    return this.$errors
  }

  /**
   * delete a key from rhe $errors object
   *
   * @param fieldName
   * @returns {Errors}
   */
  delete(fieldName) {
    if (this.has(fieldName)) {
      delete this.$errors[fieldName]
    }

    return this
  }

  /**
   * check if field error exists in the $errors object
   *
   * @param fieldName
   * @returns {boolean}
   */
  has(fieldName) {
    return this.$errors.hasOwnProperty(fieldName)
  }

  /**
   * checks if there is any errors in the $errors object
   *
   * @returns {boolean}
   */
  any() {
    return Object.keys(this.$errors).length > 0
  }

  /**
   * clear all the $errors object
   *
   * @returns {Errors}
   */
  clear() {
    this.$errors = {}

    return this
  }
}

