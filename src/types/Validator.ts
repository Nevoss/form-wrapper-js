import { MessageFunction, PassesFunction } from './Errors'
import { Rule } from '../core/Rule'

/**
 * Raw Rule is an object that can be transfer eventually to a normal Rule Object
 */
export interface RawRule {
  passes: PassesFunction
  message?: MessageFunction | string
}

/**
 * Holds all the rules.
 * each key is the field which hold an array of rules
 */
export interface RulesStack {
  [fieldKey: string]: Rule[]
}
