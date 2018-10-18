import { Errors } from "./Errors";

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
   * @type {{clearErrorsAfterSuccessfulSubmission: boolean, resetDataAfterSuccessfulSubmission: boolean}}
   */
  $options = {
    clearErrorsAfterSuccessfulSubmission: true,
    resetDataAfterSuccessfulSubmission: true,
  };

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
    this.reset()
  }

  /**
   * reset the form
   * set all the fields value same as $originalData fields value
   * and clear all the errors
   *
   * @returns {Form}
   */
  reset = () => {
    for (let fieldName in this.$originalData) {
      if (this.$originalData.hasOwnProperty(fieldName)) {
        this[fieldName] = this.$originalData[fieldName]
      }
    }

    this.$errors.clear();

    return this
  }

  /**
   * get all the data of the form
   *
   * @returns {Object}
   */
  data = () => {
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
  fill = (newData) => {
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
  submit = (callback) => {
    if (!this.$submitting) {
      this.$submitting = true

      return callback(this)
        .then(this.successfulSubmission.bind(this))
        .catch(this.unSuccessfulSubmission.bind(this))
    }

    return Promise.reject()
  }

  /**
   * Successful Submission
   *
   * @param response
   * @returns {Promise.<*>}
   */
  successfulSubmission = (response) => {
    this.$submitting = false

    if (this.$options.clearErrorsAfterSuccessfulSubmission) {
      this.$errors.clear()
    }

    if (this.$options.resetDataAfterSuccessfulSubmission) {
      this.reset()
    }

    Form.successfulSubmissionHook(response)

    return Promise.resolve(response)
  }

  /**
   * UnSuccessful submission
   *
   * @param error
   * @returns {Promise.<*>}
   */
  unSuccessfulSubmission = (error) => {
    this.$submitting = false

    Form.unSuccessfulSubmissionHook(error)

    return Promise.reject(error)
  }

  /**
   * assign options to $options object
   *
   * @param options
   */
  assignOptions = (options) => {
    this.$options = Object.assign(this.$options, options)
  }

  /**
   * Hook for successful submission
   * use Form.prototype.successfulSubmissionHook = () => {};
   * for extending the successful submission handling
   *
   * @param response
   */
  static successfulSubmissionHook(response) {
    //
  }

  /**
   * Hook for un successful submission
   * use Form.prototype.unSuccessfulSubmissionHook = () => {};
   * for extending the un successful submission handling
   *
   * @param error
   */
  static unSuccessfulSubmissionHook(error) {
    //
  }
}