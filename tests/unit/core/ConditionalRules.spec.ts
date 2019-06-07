import { ConditionalRules } from '../../../src/core/ConditionalRules'
import createConditionalRules from '../../../src/factories/ConditionalRulesFactory'
import { createFakeRule } from '../../fake-data'

jest.mock('../../../src/core/Rule')
jest.mock('../../../src/factories/ConditionalRulesFactory', () =>
  jest.fn(() => 'mock')
)

describe('core/ConditionalRules.ts', (): void => {
  it('should construct correctly', (): void => {
    const condition = jest.fn()
    const rules = [createFakeRule()]

    const conditionalRules = new ConditionalRules(condition, rules)

    expect(conditionalRules.condition).toBe(condition)
    expect(conditionalRules.all()).toEqual(rules)
  })

  it('should call the ConditionalRules factory', (): void => {
    const condition = jest.fn()
    const rulesDeclaration = [jest.fn()]

    const conditionalRules = ConditionalRules.create(
      condition,
      rulesDeclaration
    )

    expect(createConditionalRules).toHaveBeenLastCalledWith(
      condition,
      rulesDeclaration
    )
    expect(conditionalRules).toBe('mock')
  })
})
