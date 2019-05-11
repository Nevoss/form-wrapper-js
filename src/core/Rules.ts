import { FieldsCollection } from '../helpers/FieldsCollection'
import { RuleDeclaration, RulePassesFunction } from '../types/validation'
import { Rule } from './Rule'

export class Rules extends FieldsCollection<Rule[]> {
  /**
   * generate a field Rules from RuleDeclaration or RulePassesFunction array
   *
   * @param key
   * @param rules
   */
  public generateFieldRules(
    key: string,
    rules: (RuleDeclaration | RulePassesFunction)[]
  ): this {
    this.items[key] = rules.map(
      (rule: RuleDeclaration | RulePassesFunction): Rule => Rule.create(rule)
    )

    return this
  }

  /**
   * get field rules
   *
   * @param key
   */
  public get(key: string): Rule[] {
    return super.get(key, [])
  }
}
