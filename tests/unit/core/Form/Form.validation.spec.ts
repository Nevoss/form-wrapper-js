import { Form } from '../../../../src/core/Form'
import { Rules } from '../../../../src/core/Rules'
import { Rule } from '../../../../src/core/Rule'
import { FormWithFields } from '../../../../src/types/form'
import { Errors } from '../../../../src/core/Errors'
import { Interceptors } from '../../../../src/core/Interceptors'
import warn from '../../../../src/warn'
import { createFakeField } from '../../../fake-data'
import { mocked } from 'ts-jest/utils'
import createRuleMessageFunction from '../../../../src/factories/RuleMessageFunctionFactory'
import { RuleValidationError } from '../../../../src/errors/RuleValidationError'
import { OptionalOptions } from '../../../../src/types/options'

jest.mock('../../../../src/core/Interceptors')
jest.mock('../../../../src/factories/RuleMessageFunctionFactory')
jest.mock('../../../../src/warn')
jest.mock('../../../../src/core/Rule')

describe('core/Form.ts - validation', (): void => {
  const createForm = (
    fieldName: string,
    rules: Rule[] = [],
    options: OptionalOptions = {}
  ): FormWithFields => {
    const rulesObject = new Rules({
      [fieldName]: rules,
    })

    const form = new Form('1', new Rules(), new Errors(), {
      submissionComplete: new Interceptors(),
      beforeSubmission: new Interceptors(),
    })

    form.$addField(fieldName, null)
    form.$assignOptions(options)
    form.$rules = rulesObject

    form.$getField = jest.fn(() => createFakeField())

    return form
  }

  afterEach(
    (): void => {
      mocked(createRuleMessageFunction).mockClear()
    }
  )

  it('should validate field and warn if the field not exists', async (): Promise<
    any
  > => {
    const form = createForm('name')

    await form.$validateField('last_name')

    expect(warn).toHaveBeenLastCalledWith(
      false,
      expect.stringContaining('last_name')
    )

    await form.$validateField('name')

    expect(warn).toHaveBeenLastCalledWith(true, expect.stringContaining('name'))
  })

  it('should validate field and run over all of the rules', async (): Promise<
    any
  > => {
    const rule1 = new Rule(jest.fn())
    const rule2 = new Rule(jest.fn())

    const form = createForm('name', [rule1, rule2])

    await form.$validateField('name')

    const getFieldResult = mocked(form.$getField).mock.results[0].value
    const defaultMessage = mocked(createRuleMessageFunction).mock.results[0]
      .value

    expect(rule1.validate).toHaveBeenCalledWith(
      getFieldResult,
      form,
      defaultMessage
    )

    expect(rule2.validate).toHaveBeenCalledWith(
      getFieldResult,
      form,
      defaultMessage
    )

    expect(form.$errors.any()).toBe(false)
    expect(form.$validating.has('name')).toBe(false)
  })

  it('should add errors if the validation failed', async (): Promise<any> => {
    const rule1 = new Rule(jest.fn())
    const rule2 = new Rule(jest.fn())
    const rule3 = new Rule(jest.fn())

    rule2.validate = jest.fn(() => {
      throw new RuleValidationError('error1')
    })

    rule3.validate = jest.fn(() => {
      throw new RuleValidationError('error2')
    })

    const form = createForm('name', [rule1, rule2, rule3], {
      validation: {
        stopAfterFirstRuleFailed: false,
      },
    })

    await form.$validateField('name')

    const errors = form.$errors.get('name')

    expect(errors.length).toBe(2)
    expect(errors[0]).toBe('error1')
    expect(errors[1]).toBe('error2')
  })

  it('should stop after first error if `stopAfterFirstRuleFailed` set to true', async (): Promise<
    any
  > => {
    const rule1 = new Rule(jest.fn())
    const rule2 = new Rule(jest.fn())
    const rule3 = new Rule(jest.fn())

    rule2.validate = jest.fn(() => {
      throw new RuleValidationError('error1')
    })

    rule3.validate = jest.fn(() => {
      throw new RuleValidationError('error2')
    })

    const form = createForm('name', [rule1, rule2, rule3], {
      validation: {
        stopAfterFirstRuleFailed: true,
      },
    })

    await form.$validateField('name')

    const errors = form.$errors.get('name')

    expect(errors.length).toBe(1)
    expect(errors[0]).toBe('error1')
  })

  it('should make the error bubble up if the error is not RuleValidationError', async (): Promise<
    any
  > => {
    const rule = new Rule(jest.fn())

    rule.validate = jest.fn(() => {
      throw new Error('error')
    })

    const form = createForm('name', [rule])

    expect.assertions(2)

    try {
      await form.$validateField('name')
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
      expect(e.message).toBe('error')
    }
  })

  it('should mark the field as validating when validating', (): void => {
    const rule = new Rule(jest.fn())
    const form = createForm('name', [rule])

    form.$validateField('name')

    expect(form.$validating.has('name')).toBe(true)
  })
})
