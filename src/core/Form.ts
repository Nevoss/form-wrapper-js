import { Errors } from './Errors'
import { Rules } from './Rules'
import { Interceptors } from './Interceptors'
import { Collection } from '../helpers/Collection'
import { FormCollection } from './FormCollection'
import { OptionalOptions, Options } from '../types/options'
import { FormDefaults, FormWithFields, SubmitCallback } from '../types/form'
import {
  Field,
  FieldDeclaration,
  FieldsDeclaration,
  OptionalFieldDeclaration,
} from '../types/fields'
import warn from '../warn'
import createForm from '../factories/FormFactory'
import defaultOptions from '../default-options'
import generateOptions from '../helpers/generateOptions'
import generateFieldDeclaration from '../helpers/generateFieldDeclaration'
import generateDebouncedValidateField from '../helpers/generateDebouncedValidateField'
import { objectToFormData } from '../utils'
import { Rule } from './Rule'
import { RuleValidationError } from '../errors/RuleValidationError'
import createRuleMessageFunction from '../factories/RuleMessageFunctionFactory'
import { ConditionalRules } from './ConditionalRules'
import { Interceptor } from '../types/interceptors'

export class Form {
  /**
   * trigger the FormFactory to create a Form object
   *
   * @param fields
   * @param options
   */
  public static create(
    fields: FieldsDeclaration = {},
    options: OptionalOptions = {}
  ): FormWithFields {
    return createForm(fields, options)
  }

  /**
   * Assign default options to the Form class in more
   * convenient way then "Form.defaults.options.validation.something = something"
   *
   * @param options
   */
  public static assignDefaultOptions(options: OptionalOptions): void {
    Form.defaults.options = generateOptions(Form.defaults.options, options)
  }

  /**
   * holds all the defaults for the forms
   */
  public static defaults: FormDefaults = {
    options: defaultOptions,
    interceptors: {
      beforeSubmission: new Interceptors(),
      submissionComplete: new Interceptors(),
    },
  }

  /**
   * Unique ID for the Form instance.
   * the main use case is in the FormCollection
   * to set a unique ID for every Form there
   */
  public $id: string

  /**
   * RulesManager - hold all the fields rules.
   */
  public $rules: Rules

  /**
   * Errors class - holds all the fields errors
   */
  public $errors: Errors

  /**
   * Object of interceptors:
   * beforeSubmission: interceptors that will be handled before submission
   * submissionComplete: interceptors that will be handled after submission
   */
  public $interceptors: {
    beforeSubmission: Interceptors
    submissionComplete: Interceptors
  }

  /**
   * holds all the fields that was touched
   */
  public $touched: Collection<string>

  /**
   * holds all the fields keys that are in validation right now
   */
  public $validating: Collection<string>

  /**
   * Options of the Form
   */
  public $options: Options = Form.defaults.options

  /**
   * The initiate values of the fields
   */
  public $initialValues: { [key: string]: any } = {}

  /**
   * Holds all the labels of the fields
   */
  public $labels: { [key: string]: string } = {}

  /**
   * Holds all the extra data of a field
   */
  public $extra: { [key: string]: any } = {}

  /**
   * determine if the form is on submitting mode
   */
  public $submitting: boolean = false

  /**
   * Form Constructor
   *
   * @param id
   * @param rules
   * @param errors
   * @param interceptors
   */
  public constructor(
    id: string,
    rules: Rules,
    errors: Errors,
    interceptors: {
      beforeSubmission: Interceptors
      submissionComplete: Interceptors
    }
  ) {
    this.$id = id
    this.$rules = rules
    this.$errors = errors
    this.$interceptors = interceptors
    this.$touched = new Collection()
    this.$validating = new Collection()
  }

  /**
   * assign options to the form
   * also generate again the debouncedValidationField method
   * in case the `debouncedValidateFieldTime` was changed
   *
   * @param options
   */
  public $assignOptions(options: OptionalOptions): FormWithFields {
    this.$options = generateOptions(this.$options, options)
    this.$debouncedValidateField = generateDebouncedValidateField(this)

    return this
  }

  /**
   * checks if field key is exists in the form
   *
   * @param fieldKey
   */
  public $hasField(fieldKey: string): boolean {
    return this.hasOwnProperty(fieldKey)
  }

  /**
   * Add a field to the form
   *
   * @param fieldKey
   * @param value
   */
  public $addField(
    fieldKey: string,
    value: any | OptionalFieldDeclaration
  ): FormWithFields {
    warn(!this.$hasField(fieldKey), `'${fieldKey}' is already exists`)

    const fieldDeclaration: FieldDeclaration = generateFieldDeclaration(
      fieldKey,
      value
    )

    this[fieldKey] = fieldDeclaration.value
    this.$rules.generateFieldRules(fieldKey, fieldDeclaration.rules)
    this.$extra[fieldKey] = fieldDeclaration.extra
    this.$labels[fieldKey] = fieldDeclaration.label
    this.$initialValues[fieldKey] =
      fieldDeclaration.value instanceof FormCollection
        ? fieldDeclaration.value.values()
        : fieldDeclaration.value

    return this
  }

  /**
   * Add number of fields to the form
   *
   * @param fields
   */
  public $addFields(fields: FieldsDeclaration): FormWithFields {
    Object.keys(fields).forEach(
      (fieldKey: string): void => {
        this.$addField(fieldKey, fields[fieldKey])
      }
    )

    return this
  }

  /**
   * Remove a field from the form
   *
   * @param fieldKey
   */
  public $removeField(fieldKey: string): FormWithFields {
    warn(this.$hasField(fieldKey), `'${fieldKey}' is not a valid field`)

    delete this[fieldKey]
    delete this.$initialValues[fieldKey]
    delete this.$extra[fieldKey]
    delete this.$labels[fieldKey]
    this.$rules.unset(fieldKey)

    return this
  }

  /**
   * return all the field keys of the form
   */
  public $getFieldKeys(): string[] {
    return Object.keys(this.$initialValues)
  }

  /**
   * get Field
   * returns data about the field, mostly used for validation
   *
   * @param fieldKey
   */
  public $getField(fieldKey: string): Field {
    return {
      key: fieldKey,
      label: this.$labels[fieldKey],
      value: this[fieldKey],
      extra: this.$extra[fieldKey],
    }
  }

  /**
   * Remove number of fields
   *
   * @param fieldKeys
   */
  public $removeFields(fieldKeys: string[]): FormWithFields {
    fieldKeys.forEach(
      (fieldKey: string): void => {
        this.$removeField(fieldKey)
      }
    )

    return this
  }

  /**
   * return the values of the fields in the form
   */
  public $values(): { [key: string]: any } {
    const values = {}

    this.$getFieldKeys().forEach(
      (fieldKey: string): void => {
        values[fieldKey] =
          this[fieldKey] instanceof FormCollection
            ? this[fieldKey].values()
            : this[fieldKey]
      }
    )

    return values
  }

  /**
   * Returns FormData object with the form values,
   * this one is for the use of file upload ot something similar.
   */
  public $valuesAsFormData(): FormData {
    return objectToFormData(this.$values())
  }

  /**
   * returns the form values as a json string.
   */
  public $valuesAsJson(): string {
    return JSON.stringify(this.$values())
  }

  /**
   * fill the Form values with new values.
   * without remove another fields values.
   * if `updateInitialValues` is sets to true the $initialValues of the form
   * will be updated to the new values
   *
   * @param data
   * @param updateInitialValues
   */
  public $fill(
    data: { [key: string]: any },
    updateInitialValues: boolean = false
  ): FormWithFields {
    Object.keys(data).forEach(
      (fieldKey: string): void => {
        if (!this.$hasField(fieldKey)) {
          return
        }

        const isFormCollection = this[fieldKey] instanceof FormCollection

        const value = isFormCollection
          ? this[fieldKey].fill(data[fieldKey], updateInitialValues)
          : data[fieldKey]

        if (updateInitialValues) {
          this.$initialValues[fieldKey] = isFormCollection
            ? value.values()
            : value
        }

        this[fieldKey] = value
      }
    )

    return this
  }

  /**
   * Set all the fields value same as the $initialValues fields value
   */
  public $resetValues(): FormWithFields {
    this.$fill(this.$initialValues)

    return this
  }

  /**
   * determine if field is dirty
   *
   * @param fieldKey
   */
  public $isFieldDirty(fieldKey: string): boolean {
    warn(this.$hasField(fieldKey), `'${fieldKey}' is not a valid field`)

    return (
      this.$hasField(fieldKey) &&
      (this[fieldKey] instanceof FormCollection
        ? this[fieldKey].isDirty()
        : this[fieldKey] !== this.$initialValues[fieldKey])
    )
  }

  /**
   * determine if the form is dirty.
   * if one of the fields is dirty thw whole form consider as dirty
   */
  public $isFormDirty(): boolean {
    return this.$getFieldKeys().some(
      (fieldKey: string): boolean => this.$isFieldDirty(fieldKey)
    )
  }

  /**
   * if fieldKey is passed as argument it checks if the field is dirty
   * if not it checks if the whole form is dirty
   *
   * @param fieldKey
   */
  public $isDirty(fieldKey: string | null = null): boolean {
    return fieldKey !== null
      ? this.$isFieldDirty(fieldKey)
      : this.$isFormDirty()
  }

  /**
   * reset the form state (values, errors and touched)
   */
  public $reset(): FormWithFields {
    this.$resetValues()
    this.$errors.clear()
    this.$touched.clear()

    return this
  }

  /**
   * validate a specific field
   *
   * @param fieldKey
   */
  public async $validateField(fieldKey: string): Promise<any> {
    warn(this.$hasField(fieldKey), `'${fieldKey}' is not a valid field`)

    const defaultMessage = createRuleMessageFunction(
      this.$options.validation.defaultMessage
    )

    let fieldRulesChain: (Rule | ConditionalRules)[] = Array.from(
      this.$rules.get(fieldKey)
    )
    const field: Field = this.$getField(fieldKey)

    while (fieldRulesChain.length) {
      let rule = fieldRulesChain.shift()

      if (rule === undefined) {
        continue
      }

      this.$validating.push(fieldKey)

      try {
        if (rule instanceof ConditionalRules) {
          rule.condition(field, this) &&
            (fieldRulesChain = [...rule.all(), ...fieldRulesChain])

          continue
        }

        await rule.validate(field, this, defaultMessage)

        if (field.value instanceof FormCollection) {
          await field.value.validate()
        }
      } catch (error) {
        // If the error is not a RuleValidationError - the error will bubble up
        if (!(error instanceof RuleValidationError)) {
          throw error
        }

        this.$errors.push(fieldKey, error.message)

        this.$options.validation.stopAfterFirstRuleFailed &&
          (fieldRulesChain = [])
      }

      this.$validating.unset(fieldKey)
    }
  }

  /**
   * Debounced version $validateField method
   *
   * @param fieldKey
   */
  public $debouncedValidateField(fieldKey: string): void {}

  /**
   * validate all the fields of the form
   */
  public $validateForm(): Promise<any> {
    const promises = this.$getFieldKeys().map(
      (fieldKey: string): Promise<any> => {
        return this.$validateField(fieldKey)
      }
    )

    return Promise.all(promises)
  }

  /**
   * validate specific key or the whole form.
   *
   * @param fieldKey
   */
  public $validate(fieldKey: string | null = null): Promise<any> {
    return fieldKey ? this.$validateField(fieldKey) : this.$validateForm()
  }

  /**
   * returns if is validating the field or the whole form
   *
   * @param fieldKey
   */
  public $isValidating(fieldKey: string | null = null): boolean {
    warn(
      !fieldKey || this.$hasField(fieldKey),
      `\`${fieldKey}\` is not a valid field`
    )

    return fieldKey ? this.$validating.has(fieldKey) : this.$validating.any()
  }

  /**
   * submit the form.
   * this method received a callback that must return a Promise.
   *
   * @param callback
   */
  public $submit(callback: SubmitCallback): Promise<any> {
    let chain: any[] = [
      (): Promise<any> => callback(this),
      null,
      (response): Promise<any> => Promise.resolve({ response, form: this }),
      (error): Promise<any> => Promise.reject({ error, form: this }),
    ]

    this.$interceptors.beforeSubmission.forEach(
      (handler: Interceptor): void => {
        chain.unshift(handler.fulfilled, handler.rejected)
      }
    )

    this.$interceptors.submissionComplete.forEach(
      (handler: Interceptor): void => {
        chain.push(handler.fulfilled, handler.rejected)
      }
    )

    let promise: Promise<any> = Promise.resolve(this)

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift())
    }

    return promise
  }
}
