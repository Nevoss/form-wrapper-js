import { Rule } from '../../../src/core/Rule'
import createRule from '../../../src/factories/RuleFactory'
import { RulePassesFunction } from '../../../src/types/validation'
import { Form } from '../../../src/core/Form'
import { Field } from '../../../src/types/fields'
import { RuleValidationError } from '../../../src/errors/RuleValidationError'

jest.mock('../../../src/core/Form')
jest.mock(
  '../../../src/factories/RuleFactory',
  (): object => {
    return {
      __esModule: true,
      default: jest.fn((): string => 'fakeResponse'),
    }
  }
)

describe('core/Rule.ts', (): void => {
  let fakeForm: Form = Form.create()
  let fakeField: Field = { key: 'a', label: 'a', value: 'a', extras: 'a' }

  it('should construct correctly', (): void => {
    const passesFunc = (): boolean => true
    const messageFunc = (): string => 'Error!'

    const rule = new Rule(passesFunc, messageFunc)
    const rule2 = new Rule(passesFunc)

    expect(rule.passes).toBe(passesFunc)
    expect(rule.message).toBe(messageFunc)
    expect(rule2.passes).toBe(passesFunc)
    expect(rule2.message).toBe(null)
  })

  it('should create a Rule with the ruleFactory', (): void => {
    const argument = jest.fn()

    const response = Rule.create(argument)

    expect(createRule).toHaveBeenCalledWith(argument)
    expect(response).toBe('fakeResponse')
  })

  it('should validate the Rule with a function that returns true', async (): Promise<
    any
  > => {
    const passes: RulePassesFunction = jest.fn((): boolean => true)

    const rule = new Rule(passes)

    await expect(rule.validate(fakeField, fakeForm)).resolves

    expect(passes).toHaveBeenCalledTimes(1)
    expect(passes).toHaveBeenCalledWith(fakeField, fakeForm)
  })

  it('should validate the Rule with a function that returns false', async (): Promise<
    any
  > => {
    const passes: RulePassesFunction = jest.fn((): boolean => false)

    const rule = new Rule(passes)

    expect.assertions(3)

    try {
      await rule.validate(fakeField, fakeForm)
    } catch (e) {
      expect(e).toBeInstanceOf(RuleValidationError)
    }

    expect(passes).toHaveBeenCalledTimes(1)
    expect(passes).toHaveBeenCalledWith(fakeField, fakeForm)
  })

  it('should validate the Rule with a function that returns Promise', async (): Promise<
    any
  > => {
    const promise = Promise.resolve()
    const passes = jest.fn((): Promise<any> => promise)

    const rule = new Rule(passes)

    await expect(rule.validate(fakeField, fakeForm)).toBe(promise)

    expect(passes).toHaveBeenCalledTimes(1)
    expect(passes).toHaveBeenCalledWith(fakeField, fakeForm)
  })

  it('should validate the Rule even if the returns value of a function is not boolean or promise', async (): Promise<
    any
  > => {
    const passes = jest.fn((): string => '')
    const passes2 = jest.fn((): number => 123)

    // @ts-ignore
    const rule = new Rule(passes)
    // @ts-ignore
    const rule2 = new Rule(passes2)

    expect.assertions(5)

    try {
      await rule.validate(fakeField, fakeForm)
    } catch (e) {
      expect(e).toBeInstanceOf(RuleValidationError)
    }

    await expect(rule2.validate(fakeField, fakeForm)).resolves

    expect(passes).toHaveBeenCalledTimes(1)
    expect(passes).toHaveBeenCalledWith(fakeField, fakeForm)

    expect(passes2).toHaveBeenCalledTimes(1)
    expect(passes2).toHaveBeenCalledWith(fakeField, fakeForm)
  })
})
