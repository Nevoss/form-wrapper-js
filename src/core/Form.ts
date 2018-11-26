import {Errors} from "./Errors"
import {Validator} from "./Validator"
import {Field, Options, SubmitCallback} from "../types"
import {isObject} from "../utils"
import generateDefaultLabel from "../helpers/generateDefaultLabel"
import generateOptions from '../helpers/generateOptions'
import defaultsOptions from '../defaults'

export class Form {

  /**
   * Defaults options for the Form instance
   */
  public static defaults: Options = defaultsOptions

  /**
   * determine if the form is on submitting mode
   */
  public $submitting: boolean = false

  /**
   * Errors class - handling all the errors of the fields
   */
  public $errors: Errors

  /**
   * Validator class - handling all the validations stuff
   */
  public $validator: Validator

  /**
   * Holds all the labels of the fields
   */
  public $labels: Object

  /**
   * The initiate data that was provide to the form
   */
  public $originalData: Object

  /**
   * all the extra data that provide in the construction of this class
   * will be hold here.
   */
  public $extra: Object

  /**
   * Options of the Form
   */
  public $options: Options = Form.defaults

  /**
   * constructor of the class
   *
   * @param data
   * @param options
   */
  constructor(data: Object, options: Options = {}) {
    this.assignOptions(options)
      .init(data)
      .reset()
  }

  /**
   * Init the form
   * fill all the data that should be filled (Validator, OriginalData etc..(
   *
   * @param data
   */
  private init(data: Object): Form {
    let rules = {}
    let originalData = {}
    let labels = {}
    let extra = {}

    Object.keys(data).forEach(key => {

      if (isObject(data[key])) {
        originalData[key] = data[key].value

        if (data[key].hasOwnProperty('rules')) {
          rules[key] = data[key].rules
        }

        if (data[key].hasOwnProperty('label')) {
          labels[key] = data[key].label
        }

        if (data[key].hasOwnProperty('extra')) {
          extra[key] = data[key].extra
        }
      }

      labels[key] = key in labels ? labels[key] : generateDefaultLabel(key)
      originalData[key] = key in originalData ? originalData[key] : data[key]
      extra[key] = key in extra ? extra[key] : {}
    })

    this.$originalData = originalData
    this.$labels = labels
    this.$extra = extra
    this.$validator = new Validator(rules, this.$options.validation)
    this.$errors = new Errors()

    return this
  }

  /**
   * Set all the fields value same as $originalData fields value
   */
  public reset(): Form {
    for (let fieldName in this.$originalData) {
      if (this.$originalData.hasOwnProperty(fieldName)) {
        this[fieldName] = this.$originalData[fieldName]
      }
    }

    return this
  }

  /**
   * get all the data of the form
   */
  public data(): Object {
    let dataObj = {}

    Object.keys(this.$originalData).forEach(fieldKey => {
      if (this.hasOwnProperty(fieldKey)) {
        dataObj[fieldKey] = this[fieldKey]
      }
    })

    return dataObj
  }

  /**
   * fill the Form data with new data.
   * without remove another fields data.
   *
   * @param newData
   */
  public fill(newData: Object): Form {
    for (let fieldName in newData) {
      if (newData.hasOwnProperty(fieldName) && this.$originalData.hasOwnProperty(fieldName)) {
        this[fieldName] = newData[fieldName]
      }
    }

    return this
  }

  /**
   * validate specific key or the whole form.
   *
   * @param fieldKey
   */
  public validate(fieldKey: string | null = null): boolean {
    return fieldKey ? this.validateField(fieldKey) : this.validateAll()
  }

  /**
   * validate specific field
   *
   * @param fieldKey
   */
  public validateField(fieldKey: string): boolean {
    if (!this.hasOwnProperty(fieldKey)) {
      return true
    }

    this.$errors.clearField(fieldKey)

    const errors = this.$validator.validateField(
      this.buildFieldObject(fieldKey),
      this
    )

    if (errors.length > 0) {
      this.$errors.append({ [fieldKey]: errors })
    }

    return errors.length === 0
  }

  /**
   * validate all the fields of the form
   */
  public validateAll(): boolean {
    let isValid = true

    Object.keys(this.data()).forEach(fieldKey => {
      if (!this.validateField(fieldKey)) {
        isValid = false
      }
    })

    return isValid
  }

  /**
   * build Field object
   *
   * @param fieldKey
   */
  private buildFieldObject(fieldKey: string): Field {
    return {
      key: fieldKey,
      value: this[fieldKey],
      label: this.$labels[fieldKey]
    }
  }

  /**
   * assign options to Options object
   *
   * @param options
   */
  public assignOptions(options: Options) {
    this.$options = generateOptions(this.$options, options)

    return this
  }

  /**
   * submit the form, this method received a callback that
   * will submit the form and must return a Promise.
   *
   * @param callback
   */
  public submit(callback: SubmitCallback): Promise<any> {
    if (this.$options.validation.onSubmission && !this.validate()) {
      return Promise.reject({ message: 'Form is not valid' })
    }

    this.$submitting = true

    return callback(this)
      .then(this.successfulSubmission.bind(this))
      .catch(this.unSuccessfulSubmission.bind(this))
  }

  /**
   * Successful submission method
   *
   * @param response
   */
  private successfulSubmission(response: any): Promise<any> {
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
   * UnSuccessful submission method
   *
   * @param error
   */
  private unSuccessfulSubmission(error: any): Promise<any> {
    this.$submitting = false

    return Form.unSuccessfulSubmissionHook(error, this)
  }

  /**
   * Hook for successful submission
   * use Form.successfulSubmissionHook = () => {};
   * for extending the successful submission handling
   *
   * @param response
   * @param form
   */
  static successfulSubmissionHook(response: any, form: Form): Promise<any> {
    return Promise.resolve(response)
  }

  /**
   * Hook for un successful submission
   * use Form.unSuccessfulSubmissionHook = () => {};
   * for extending the un successful submission handling
   *
   * @param error
   * @param form
   */
  static unSuccessfulSubmissionHook(error: any, form: Form): Promise<any> {
    return Promise.reject(error)
  }
}
