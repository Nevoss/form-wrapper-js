import { RawRule } from './Validator'
import { PassesFunction } from './Errors'

/**
 * Field object that passes the PassesFunction and MessageFunction,
 * it used in the Validator class.
 */
export interface Field {
  key: string
  label: string
  value: any
}

/**
 * Field options is an object that describe the field,
 * initial value, extras for the extra data that the field should hold,
 * rules are the constraints of the field and label is just the visible
 * value of the field/
 */
export interface FieldOptions {
  value: any
  extra?: any
  rules?: Array<RawRule | PassesFunction>
  label?: string
}

/**
 * This interface declare the fields of the form
 */
export interface RawFormFields {
  [fieldKey: string]: any | FieldOptions
}
