import { Collection } from '../helpers/Collection'
import { Rule } from './Rule'
import createConditionalRules from '../factories/ConditionalRulesFactory'
import {
  ConditionalRulesConditionFunction,
  RuleDeclaration,
  RulePassesFunction,
} from '../types/validation'

export class ConditionalRules extends Collection<Rule> {
  /**
   * quick way to create ConditionalRules
   *
   * @param condition
   * @param rules
   */
  public static create(
    condition: ConditionalRulesConditionFunction,
    rules: (RuleDeclaration | RulePassesFunction)[]
  ): ConditionalRules {
    return createConditionalRules(condition, rules)
  }

  /**
   * Condition that runs and determine if the rules should be run
   */
  public condition: ConditionalRulesConditionFunction

  /**
   * ConditionalRules constructor
   *
   * @param condition
   * @param rules
   */
  public constructor(
    condition: ConditionalRulesConditionFunction,
    rules: Rule[]
  ) {
    super()
    this.condition = condition
    this.fill(rules)
  }
}
