import { Errors } from "./Errors";
import { Validator } from "./Validator";
import generateDefaultLabel from '../helpers/generateDefaultLabel'
import { isObject, mergeDeep } from "../utils";
import defaultsOptions from '../defaults'

export class Form {

  /**
   * determine if the form is on submitting mode
   *
   * @type {boolean}
   */
  $submitting = false

  /**
   * Errors class
   *
   * @type {null|Errors}
   */
  $errors = null

  /**
   * Validator class
   *
   * @type {null|Validator}
   */
  $validator = null

  /**
   * labels of the fields
   *
   * @type {{}}
   */
  $labels = {}

  /**
   * hold the original data that inject to the Form instance
   *
   * @type {Object}
   */
  $originalData = {};

  /**
   * options
   *
   * @type {Object}
   */
  $options = defaultsOptions;

  /**
   * constructor
   *
   * @param data
   * @param options
   */
  constructor(data, options) {
    this.assignOptions(options)
      ._init(data)
      .reset()
  }

  /**
   * init the bare bones of the Form class
   *
   * @param data
   * @returns {Form}
   * @private
   */
  _init(data) {
    let rules = {}
    let originalData = {}
    let labels = {}

    Object.keys(data).forEach(key => {

      if (isObject(data[key])) {
        originalData[key] = data[key].value

        if (data[key].hasOwnProperty('rules')) {
          rules[key] = data[key].rules
        }

        if (data[key].hasOwnProperty('label')) {
          labels[key] = data[key].label
        }
      }

      labels[key] = key in labels ? labels[key] : generateDefaultLabel(key)
      originalData[key] = key in originalData ? originalData[key] : data[key]
    })

    this.$originalData = originalData
    this.$labels = labels
    this.$validator = new Validator(rules, this.$options.validation)
    this.$errors = new Errors()

    return this
  }

  /**
   * reset the form
   * set all the fields value same as $originalData fields value
   *
   * @returns {Form}
   */
  reset() {
    for (let fieldName in this.$originalData) {
      if (this.$originalData.hasOwnProperty(fieldName)) {
        this[fieldName] = this.$originalData[fieldName]
      }
    }

    return this
  }

  /**
   * get all the data of the form
   *
   * @returns {Object}
   */
  data() {
    return Object.assign(
      {},
      ...Object.keys(this.$originalData).map(
        key => this.hasOwnProperty(key) ? {[key]: this[key]} : {}
      )
    )
  }

  /**
   * fill Form with an object of data
   *
   * @param newData
   * @returns {Form}
   */
  fill(newData) {
    for (let fieldName in newData) {
      if (newData.hasOwnProperty(fieldName) && this.$originalData.hasOwnProperty(fieldName)) {
        this[fieldName] = newData[fieldName]
      }
    }

    return this
  }

  /**
   * validate field of all form data
   *
   * @param fieldKey
   * @returns {boolean}
   */
  validate(fieldKey = null) {
    return fieldKey ? this.validateField(fieldKey) : this.validateAll()
  }

  /**
   * validate one field
   *
   * @param fieldKey
   * @returns {boolean}
   */
  validateField(fieldKey) {
    if (!this.hasOwnProperty(fieldKey)) {
      return true
    }

    const errors = this.$validator
      .validateField(fieldKey, this[fieldKey])
      .map(messageFunc => messageFunc({ label: this.$labels[fieldKey], value: this[fieldKey] }, this))
    
    if (errors.length > 0) {
      this.$errors.record({ [fieldKey]: errors })
    }

    return errors.length === 0
  }

  /**
   * validate all form data
   *
   * @returns {boolean}
   */
  validateAll() {
    let isValid = true

    Object.keys(this.data()).forEach(fieldKey => {
      if (!this.validateField(fieldKey)) {
        isValid = false
      }
    })

    return isValid
  }

  /**
   * must be a callback that returns a promise determine
   * if the submit went successfully or not
   *
   * @param callback
   * @returns {Promise<T | never>}
   */
  submit(callback) {
    if (this.$options.validation.onSubmission && !this.validate()) {
      return Promise.reject({ message: 'Form is not valid' })
    }

    this.$submitting = true

    return callback(this)
      .then(this._successfulSubmission.bind(this))
      .catch(this._unSuccessfulSubmission.bind(this))
  }

  /**
   * Successful Submission
   *
   * @param response
   * @returns {Promise<any>}
   * @private
   */
  _successfulSubmission(response) {
    this.$submitting = false

    if (this.$options.successfulSubmission.clearErrors) {
      this.$errors.clear()
    }

    if (this.$options.successfulSubmission.resetData) {
      this.reset()
    }

    return Form.successfulSubmissionHook(response, this)
  }

  /**
   * UnSuccessful submission
   *
   * @param error
   * @returns {Promise<never>}
   * @private
   */
  _unSuccessfulSubmission(error) {
    this.$submitting = false

    return Form.unSuccessfulSubmissionHook(error, this)
  }

  /**
   * assign options to $options object
   *
   * @param options
   * @returns {Form}
   */
  assignOptions(options) {
    this.$options = mergeDeep(this.$options, options)

    return this
  }

  /**
   * Hook for successful submission
   * use Form.successfulSubmissionHook = () => {};
   * for extending the successful submission handling
   *
   * @param response
   * @param form
   * @returns {Promise<any>}
   */
  static successfulSubmissionHook(response, form) {
    return Promise.resolve(response)
  }

  /**
   * Hook for un successful submission
   * use Form.unSuccessfulSubmissionHook = () => {};
   * for extending the un successful submission handling
   *
   * @param error
   * @param form
   * @returns {Promise<never>}
   */
  static unSuccessfulSubmissionHook(error, form) {
    return Promise.reject(error)
  }
}
