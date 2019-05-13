import faker from 'faker'
import { Rule } from '../../../src/core/Rule'
import createRule from '../../../src/factories/RuleFactory'
import { RulePassesFunction } from '../../../src/types/validation'
import { Form } from '../../../src/core/Form'
import { Field } from '../../../src/types/fields'
import { RuleValidationError } from '../../../src/errors/RuleValidationError'
import { createFakeRuleMessageFunction } from '../../fake-data'
import { mocked } from 'ts-jest/utils'

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

    await expect(
      rule.validate(fakeField, fakeForm, createFakeRuleMessageFunction())
    ).resolves

    expect(passes).toHaveBeenCalledTimes(1)
    expect(passes).toHaveBeenCalledWith(fakeField, fakeForm)
  })

  it('should validate the Rule with a function that returns false', async (): Promise<
    any
  > => {
    const passes: RulePassesFunction = jest.fn((): boolean => false)

    const rule = new Rule(passes)
    rule.invokeErrorMessage = jest.fn((): string => faker.lorem.words())

    expect.assertions(5)

    const fakeDefaultMessage = createFakeRuleMessageFunction()

    try {
      await rule.validate(fakeField, fakeForm, fakeDefaultMessage)
    } catch (e) {
      expect(e).toBeInstanceOf(RuleValidationError)
      expect(rule.invokeErrorMessage).toHaveBeenCalledWith(
        fakeField,
        fakeForm,
        fakeDefaultMessage
      )
      expect(e.message).toBe(
        mocked(rule.invokeErrorMessage).mock.results[0].value
      )
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

    await expect(
      rule.validate(fakeField, fakeForm, createFakeRuleMessageFunction())
    ).toBe(promise)

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
    rule.invokeErrorMessage = jest.fn((): string => faker.lorem.words())

    // @ts-ignore
    const rule2 = new Rule(passes2)

    expect.assertions(7)

    const fakeDefaultMessage = createFakeRuleMessageFunction()

    try {
      await rule.validate(fakeField, fakeForm, fakeDefaultMessage)
    } catch (e) {
      expect(e).toBeInstanceOf(RuleValidationError)
      expect(rule.invokeErrorMessage).toHaveBeenCalledWith(
        fakeField,
        fakeForm,
        fakeDefaultMessage
      )
      expect(e.message).toBe(
        mocked(rule.invokeErrorMessage).mock.results[0].value
      )
    }

    await expect(rule2.validate(fakeField, fakeForm)).resolves

    expect(passes).toHaveBeenCalledTimes(1)
    expect(passes).toHaveBeenCalledWith(fakeField, fakeForm)

    expect(passes2).toHaveBeenCalledTimes(1)
    expect(passes2).toHaveBeenCalledWith(fakeField, fakeForm)
  })

  it('should invoke the rule message function', (): void => {
    const fakeMessageFunction = createFakeRuleMessageFunction()
    const fakeDefaultMessageFunction = createFakeRuleMessageFunction()

    const rule = new Rule(jest.fn(), fakeMessageFunction)

    const message = rule.invokeErrorMessage(
      fakeField,
      fakeForm,
      fakeDefaultMessageFunction
    )

    expect(fakeMessageFunction).toHaveBeenCalledWith(fakeField, fakeForm)
    expect(fakeDefaultMessageFunction).not.toHaveBeenCalled()
    expect(message).toBe(mocked(fakeMessageFunction).mock.results[0].value)
  })

  it('should invoke the default message function', (): void => {
    const fakeDefaultMessageFunction = createFakeRuleMessageFunction()

    const rule = new Rule(jest.fn(), null)

    const message = rule.invokeErrorMessage(
      fakeField,
      fakeForm,
      fakeDefaultMessageFunction
    )

    expect(fakeDefaultMessageFunction).toHaveBeenCalledWith(fakeField, fakeForm)
    expect(message).toBe(
      mocked(fakeDefaultMessageFunction).mock.results[0].value
    )
  })
})
