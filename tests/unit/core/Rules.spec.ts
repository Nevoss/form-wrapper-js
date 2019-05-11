import { Rules } from '../../../src/core/Rules'
import { Rule } from '../../../src/core/Rule'

jest.mock('../../../src/core/Rule')

describe('core/Rules', (): void => {
  it('should get the rules of the field', (): void => {
    const nameRules = [new Rule((): boolean => true)]

    const rules = new Rules({
      name: nameRules,
    })

    expect(rules.get('name')).toBe(nameRules)
    expect(rules.get('last_name')).toEqual([])
  })

  it('should generate a field rules', (): void => {
    const rules = new Rules()
    const rule1 = (): boolean => true
    const rule2 = (): boolean => false

    Rule.create = jest.fn((): Rule => new Rule(rule1))

    rules.generateFieldRules('name', [rule1, rule2])

    const nameRules = rules.get('name')

    expect.assertions(6)

    expect(nameRules).toBeInstanceOf(Array)
    expect(nameRules).toHaveLength(2)
    expect(Rule.create).toHaveBeenNthCalledWith(1, rule1)
    expect(Rule.create).toHaveBeenNthCalledWith(2, rule2)

    nameRules.forEach(
      (rule): void => {
        expect(rule).toBeInstanceOf(Rule)
      }
    )
  })
})
