import { Rule } from '../core/Rule'
import { RuleDeclaration, RulePassesFunction } from '../types/validation'
import { isObject } from '../utils'
import createRuleMessageFunction from './RuleMessageFunctionFactory'

/**
 * Returns if value implements RuleDeclaration
 *
 * @param value
 */
const isRuleDeclaration = (value: any): value is RuleDeclaration => {
  return isObject(value) && typeof value.passes === 'function'
}

/**
 * Creates a Rule object from a single function of a RuleDeclaration interface
 *
 * @param value
 */
export default (value: RuleDeclaration | RulePassesFunction): Rule => {
  if (isRuleDeclaration(value)) {
    return new Rule(
      value.passes,
      value.message ? createRuleMessageFunction(value.message) : null
    )
  }

  return new Rule(value, null)
}
