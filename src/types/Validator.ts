import { MessageFunction, PassesFunction } from './Errors'

/**
 * The Rule interface in responsible to check value of field is valid,
 * and send error message if not.
 */
export interface Rule {
  passes: PassesFunction
  message: MessageFunction
}

/**
 * Holds all the rules.
 * each key is the field which hold an array of rules
 */
export interface RulesStack {
  [fieldKey: string]: Rule[]
}
