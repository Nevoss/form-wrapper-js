import { FieldsCollection } from '../helpers/FieldsCollection'
import { RuleDeclaration, RulePassesFunction } from '../types/validation'
import { Rule } from './Rule'
import { ConditionalRules } from './ConditionalRules'

export class Rules extends FieldsCollection<(Rule | ConditionalRules)[]> {
  /**
   * generate a field Rules from RuleDeclaration or RulePassesFunction array
   *
   * @param key
   * @param rules
   */
  public generateFieldRules(
    key: string,
    rules: (RuleDeclaration | RulePassesFunction | ConditionalRules)[]
  ): this {
    this.items[key] = rules.map(
      (
        rule: RuleDeclaration | RulePassesFunction | ConditionalRules
      ): Rule | ConditionalRules =>
        rule instanceof ConditionalRules ? rule : Rule.create(rule)
    )

    return this
  }

  /**
   * get field rules
   *
   * @param key
   */
  public get(key: string): (Rule | ConditionalRules)[] {
    return super.get(key, [])
  }
}
