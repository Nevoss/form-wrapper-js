import { Rules } from '../../../src/core/Rules'
import { Rule } from '../../../src/core/Rule'
import { createFakeConditionalRules, createFakeRule } from '../../fake-data'
import { mocked } from 'ts-jest/utils'

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
    const ruleCreateSpy = jest
      .spyOn(Rule, 'create')
      .mockImplementation(() => createFakeRule())

    const rules = new Rules()
    const rule1 = (): boolean => true
    const rule2 = (): boolean => false
    const conditionalsRules = createFakeConditionalRules()

    rules.generateFieldRules('name', [rule1, rule2, conditionalsRules])

    const nameRules = rules.get('name')

    expect(nameRules).toBeInstanceOf(Array)
    expect(nameRules).toHaveLength(3)
    expect(Rule.create).toHaveBeenNthCalledWith(1, rule1)
    expect(Rule.create).toHaveBeenNthCalledWith(2, rule2)
    expect(Rule.create).not.toHaveBeenNthCalledWith(3, conditionalsRules)

    const ruleCreateSpyResults = mocked(ruleCreateSpy).mock.results

    expect(nameRules[0]).toBe(ruleCreateSpyResults[0].value)
    expect(nameRules[1]).toBe(ruleCreateSpyResults[1].value)
    expect(nameRules[2]).toBe(conditionalsRules)
  })
})
