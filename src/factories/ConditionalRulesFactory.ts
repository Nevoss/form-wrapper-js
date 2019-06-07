import { ConditionalRules } from '../core/ConditionalRules'
import { Rule } from '../core/Rule'
import createRule from './RuleFactory'
import {
  ConditionalRulesConditionFunction,
  RuleDeclaration,
  RulePassesFunction,
} from '../types/validation'

/**
 * creates a ConditionalRules object
 *
 * @param condition
 * @param rules
 */
export default (
  condition: ConditionalRulesConditionFunction,
  rules: (RuleDeclaration | RulePassesFunction)[]
): ConditionalRules => {
  return new ConditionalRules(
    condition,
    rules.map(
      (rule: RuleDeclaration | RulePassesFunction): Rule => createRule(rule)
    )
  )
}
