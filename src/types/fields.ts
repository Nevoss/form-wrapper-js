import { RuleDeclaration, RulePassesFunction } from './validation'

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
}

/**
 * Fields Declaration
 * an object that every key is the field key and the value could be IFieldDeclaration
 * or just a native value for the field
 */
export interface FieldsDeclaration {
  [fieldKey: string]: any | FieldDeclaration
}
