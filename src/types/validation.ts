import { Field } from './fields'
import { FormWithFields } from './form'

/**
 * Function that will determine if the rule is passed or not
 */
export interface RulePassesFunction {
  (field: Field, form: FormWithFields): Promise<any> | boolean
}

/**
 * Function that returns the error message of the Rule
 */
export interface RuleMessageFunction {
  (field: Field, form: FormWithFields): string
}

/**
 * A Base declaration of a rule
 */
export interface RuleDeclaration {
  passes: RulePassesFunction
  message?: RuleMessageFunction | string
}
