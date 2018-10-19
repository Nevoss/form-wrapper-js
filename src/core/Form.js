import { Errors } from "./Errors";
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
   * hold the original data that inject to the Form instance
   *
   * @type {Array}
   */
  $originalData = [];

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
   * @param $options
   */
  constructor(data, $options) {
    this.$originalData = data
    this.$errors = new Errors()

    this.assignOptions($options)
    this.$errors.clear();
    this.reset()
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
   * must be a callback that returns a promise determine
   * if the submit went successfully or not
   *
   * @param callback
   * @returns {Promise.<*>}
   */
  submit(callback) {
    if (!this.$submitting) {
      this.$submitting = true

      return callback(this)
        .then(this._successfulSubmission.bind(this))
        .catch(this._unSuccessfulSubmission.bind(this))
    }

    return Promise.reject('The form is already submitting')
  }

  /**
   * Successful Submission
   *
   * @param response
   * @returns {Promise.<*>}
   */
  _successfulSubmission(response) {
    this.$submitting = false

    if (this.$options.clearErrorsAfterSuccessfulSubmission) {
      this.$errors.clear()
    }

    if (this.$options.resetDataAfterSuccessfulSubmission) {
      this.reset()
    }

    return Form.successfulSubmissionHook(response, this)
  }

  /**
   * UnSuccessful submission
   *
   * @param error
   * @returns {Promise.<*>}
   */
  _unSuccessfulSubmission(error) {
    this.$submitting = false

    return Form.unSuccessfulSubmissionHook(error, this)
  }

  /**
   * assign options to $options object
   *
   * @param options
   */
  assignOptions(options) {
    this.$options = {
      ...this.$options,
      ...options
    }
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
