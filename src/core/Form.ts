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
  FieldTransformer,
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
   * holds all the fields that was touched
   */
  public $touched: Collection<string>

  /**
   * holds all the fields keys that are in validation right now
   */
  public $validating: Collection<string>

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
   * Hold an object of transformers
   */
  public $transformers: { [key: string]: FieldTransformer } = {}

  /**
   * hold the input that is on focus right now
   */
  public $onFocus: string | null = null

  /**
   * determine if the form is on submitting mode
   */
  public $submitting: boolean = false

  /**
   * specific for FormCollection to fill the error with the prefix of the parent field
   */
  public $fieldsPrefix: string = ''

  /**
   * Form Constructor
   *
   * @param id
   * @param rules
   * @param errors
   * @param touched
   * @param validating
   * @param interceptors
   */
  public constructor(
    id: string,
    rules: Rules,
    errors: Errors,
    touched: Collection<string>,
    validating: Collection<string>,
    interceptors: {
      beforeSubmission: Interceptors
      submissionComplete: Interceptors
    }
  ) {
    this.$id = id
    this.$rules = rules
    this.$errors = errors
    this.$touched = touched
    this.$validating = validating
    this.$interceptors = interceptors
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
    const isFormCollection = fieldDeclaration.value instanceof FormCollection

    this[fieldKey] = fieldDeclaration.value
    this.$rules.generateFieldRules(fieldKey, fieldDeclaration.rules)
    this.$extra[fieldKey] = fieldDeclaration.extra
    this.$labels[fieldKey] = fieldDeclaration.label
    this.$transformers[fieldKey] = fieldDeclaration.transformer
    this.$initialValues[fieldKey] = isFormCollection
      ? fieldDeclaration.value.values()
      : fieldDeclaration.value

    if (isFormCollection) {
      this[fieldKey].parent = this
      this[fieldKey].fieldKey = fieldKey
    }

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
    delete this.$transformers[fieldKey]
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
   *
   * @param useTransformers
   */
  public $values(useTransformers: boolean = true): { [key: string]: any } {
    const values = {}

    this.$getFieldKeys().forEach(
      (fieldKey: string): void => {
        let value =
          this[fieldKey] instanceof FormCollection
            ? this[fieldKey].values(useTransformers)
            : this[fieldKey]

        if (useTransformers) {
          value = this.$transformers[fieldKey].reverseTransform(value, this)
        }

        values[fieldKey] = value
      }
    )

    return values
  }

  /**
   * Returns FormData object with the form values,
   * this one is for the use of file upload ot something similar.
   *
   * @param useTransformers
   */
  public $valuesAsFormData(useTransformers: boolean = true): FormData {
    return objectToFormData(this.$values(useTransformers))
  }

  /**
   * returns the form values as a json string.
   *
   * @param useTransformers
   */
  public $valuesAsJson(useTransformers: boolean = true): string {
    return JSON.stringify(this.$values(useTransformers))
  }

  /**
   * fill the Form values with new values.
   * without remove another fields values.
   * if `updateInitialValues` is sets to true the $initialValues of the form
   * will be updated to the new values
   *
   * @param data
   * @param updateInitialValues
   * @param useTransformers
   */
  public $fill(
    data: { [key: string]: any },
    updateInitialValues: boolean = false,
    useTransformers: boolean = true
  ): FormWithFields {
    Object.keys(data).forEach(
      (fieldKey: string): void => {
        if (!this.$hasField(fieldKey)) {
          return
        }

        const isFormCollection = this[fieldKey] instanceof FormCollection

        let value = isFormCollection
          ? this[fieldKey].fill(
              data[fieldKey],
              updateInitialValues,
              useTransformers
            )
          : data[fieldKey]

        if (!isFormCollection && useTransformers) {
          value = this.$transformers[fieldKey].transform(value, this)
        }

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

    this.$errors.unset(this.$fieldsPrefix + fieldKey)
    this.$validating.push(this.$fieldsPrefix + fieldKey)

    const defaultMessage = createRuleMessageFunction(
      this.$options.validation.defaultMessage
    )
    const field: Field = this.$getField(fieldKey)

    let fieldRulesChain: (Rule | ConditionalRules)[] = Array.from(
      this.$rules.get(fieldKey)
    )

    while (fieldRulesChain.length) {
      let rule = fieldRulesChain.shift()

      if (rule === undefined) {
        continue
      }

      try {
        if (rule instanceof ConditionalRules) {
          rule.condition(field, this) &&
            (fieldRulesChain = [...rule.all(), ...fieldRulesChain])

          continue
        }

        await rule.validate(field, this, defaultMessage)
      } catch (error) {
        // If the error is not a RuleValidationError - the error will bubble up
        if (!(error instanceof RuleValidationError)) {
          throw error
        }

        this.$errors.push(this.$fieldsPrefix + fieldKey, error.message)

        this.$options.validation.stopAfterFirstRuleFailed &&
          (fieldRulesChain = [])
      }
    }

    field.value instanceof FormCollection && (await field.value.validate())

    this.$validating.unset(this.$fieldsPrefix + fieldKey)
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
   * handle change/input event
   *
   * @param fieldKey
   */
  public $fieldChanged(fieldKey: string): FormWithFields {
    warn(this.$hasField(fieldKey), `'${fieldKey}' is not a valid field`)

    this.$options.validation.unsetFieldErrorsOnFieldChange &&
      this.$errors.unset(fieldKey)
    this.$options.validation.onFieldChanged &&
      this.$debouncedValidateField(fieldKey)

    return this
  }

  /**
   * handle focus on field
   *
   * @param fieldKey
   */
  public $fieldFocused(fieldKey: string): FormWithFields {
    warn(this.$hasField(fieldKey), `'${fieldKey}' is not a valid field`)

    this.$touched.push(fieldKey)
    this.$onFocus = fieldKey

    return this
  }

  /**
   * handle blur on field
   *
   * @param fieldKey
   */
  public $fieldBlurred(fieldKey: string): FormWithFields {
    warn(this.$hasField(fieldKey), `'${fieldKey}' is not a valid field`)

    if (this.$onFocus === fieldKey) {
      this.$onFocus = null
    }

    this.$options.validation.onFieldBlurred && this.$validateField(fieldKey)

    return this
  }

  /**
   * submit the form.
   * this method received a callback that must return a Promise.
   *
   * @param callback
   */
  public $submit(callback: SubmitCallback): Promise<any> {
    const chain: Interceptor[] = [
      ...this.$interceptors.beforeSubmission.all(),
      ...this._getRequiredInterceptors(callback),
      ...this.$interceptors.submissionComplete.all(),
    ]

    let promise = Promise.resolve(this)

    for (let interceptor of chain) {
      promise = promise.then(interceptor.fulfilled, interceptor.rejected)
    }

    return promise
  }

  /**
   * return the submit interceptors
   * the submit itself, and 2 interceptors to normalize fulfilled and rejected
   *
   * @param callback
   */
  private _getRequiredInterceptors(callback: SubmitCallback): Interceptor[] {
    return [
      {
        fulfilled: (): Promise<any> => callback(this),
        rejected: null,
      },
      {
        fulfilled: (response): Promise<any> =>
          Promise.resolve({ response, form: this }),
        rejected: (error): Promise<any> =>
          Promise.reject({ error, form: this }),
      },
    ]
  }
}
