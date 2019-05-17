import createConditionalRules from '../../../src/factories/ConditionalRulesFactory'
import createRule from '../../../src/factories/RuleFactory'
import { ConditionalRulesConditionFunction } from '../../../src/types/validation'
import { ConditionalRules } from '../../../src/core/ConditionalRules'
import { mocked } from 'ts-jest/utils'
import { createFakeRule } from '../../fake-data'

jest.mock('../../../src/core/ConditionalRules')
jest.mock('../../../src/factories/RuleFactory', () =>
  jest.fn(() => createFakeRule())
)

describe('factories/ConditionalRulesFactory', (): void => {
  it('should create ConditionalRules object', (): void => {
    const conditionFunc: ConditionalRulesConditionFunction = jest.fn(() => true)
    const rule1 = jest.fn()
    const rule2 = jest.fn()

    const rules = [rule1, rule2]

    const conditionalRules = createConditionalRules(conditionFunc, rules)

    expect(createRule).toHaveBeenNthCalledWith(1, rule1)
    expect(createRule).toHaveBeenNthCalledWith(2, rule2)

    expect(conditionalRules).toBeInstanceOf(ConditionalRules)
    expect(ConditionalRules).toHaveBeenCalledWith(
      conditionFunc,
      expect.arrayContaining([
        mocked(createRule).mock.results[0].value,
        mocked(createRule).mock.results[1].value,
      ])
    )
  })
})
