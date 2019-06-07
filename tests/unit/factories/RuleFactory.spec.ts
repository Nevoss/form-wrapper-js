import createRule from '../../../src/factories/RuleFactory'
import createRuleMessageFunction from '../../../src/factories/RuleMessageFunctionFactory'
import { RulePassesFunction } from '../../../src/types/validation'
import { Rule } from '../../../src/core/Rule'

jest.mock('../../../src/factories/RuleMessageFunctionFactory', () => {
  return {
    __esModule: true,
    default: jest.fn((): string => 'fakeResponse'),
  }
})

describe('factories/RuleFactory.ts', (): void => {
  it('should create Rule from simple RulePassesFunction', (): void => {
    const passesFunction: RulePassesFunction = jest.fn((): boolean => true)

    const rule = createRule(passesFunction)

    expect(rule).toBeInstanceOf(Rule)
    expect(rule.passes).toBe(passesFunction)
    expect(rule.message).toBe(null)
  })

  it('should create Rule from RuleDeclaration object without message', (): void => {
    const passesFunction: RulePassesFunction = jest.fn((): boolean => true)

    const rule = createRule({
      passes: passesFunction,
    })

    expect(rule).toBeInstanceOf(Rule)
    expect(rule.passes).toBe(passesFunction)
    expect(rule.message).toBe(null)
  })

  it('should create Rule from RuleDeclaration object with message property', (): void => {
    const passesFunction: RulePassesFunction = jest.fn((): boolean => true)
    const message = jest.fn()

    const rule = createRule({
      passes: passesFunction,
      message,
    })

    expect(createRuleMessageFunction).toHaveBeenCalledWith(message)
    expect(rule).toBeInstanceOf(Rule)
    expect(rule.passes).toBe(passesFunction)
    expect(rule.message).toBe('fakeResponse')
  })
})
