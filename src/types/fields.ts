import { RuleDeclaration, RulePassesFunction } from './validation'
import { FormWithFields } from './form'

/**
 * Basic Field Interface
 * mostly in use on validation `passes` and `message` functions
 */
export interface Field {
  key: string
  label: string
  value: any
  extra: any
}

/**
 * Field Declaration Interface
 * used on the Form constructor to declare the field
 */

export interface FieldDeclaration {
  value: any
  extra: any
  rules: (RuleDeclaration | RulePassesFunction)[]
  label: string
  transformer: FieldTransformer
}

/**
 * Optional Field Declaration Interface
 * same as FieldDeclaration but some keys are optional
 */
export interface OptionalFieldDeclaration {
  value: any
  extra?: any
  rules?: (RuleDeclaration | RulePassesFunction)[]
  label?: string
  transformer?: OptionalFieldTransformer
}

/**
 * Fields Declaration
 * an object that every key is the field key and the value could be IFieldDeclaration
 * or just a native value for the field
 */
export interface FieldsDeclaration {
  [fieldKey: string]: any | FieldDeclaration
}

/**
 * FieldTransformer is and object that holds 2 function
 * `transform` and `reverseTransform` the idea is to normalize
 * the data that comes in and goes out
 */
export interface FieldTransformer {
  transform: {
    (value: any, form: FormWithFields): any
  }
  reverseTransform: {
    (value: any, form: FormWithFields): any
  }
}

/**
 * The partial type of a FieldTransformer
 */
export type OptionalFieldTransformer = Partial<FieldTransformer>
