import { Form } from '../../../../src/core/Form'
import { Rules } from '../../../../src/core/Rules'
import { Rule } from '../../../../src/core/Rule'
import { FormWithFields } from '../../../../src/types/form'
import { Errors } from '../../../../src/core/Errors'
import { Interceptors } from '../../../../src/core/Interceptors'
import warn from '../../../../src/warn'
import { createFakeField, createFakeRule } from '../../../fake-data'
import { mocked } from 'ts-jest/utils'
import createRuleMessageFunction from '../../../../src/factories/RuleMessageFunctionFactory'
import { RuleValidationError } from '../../../../src/errors/RuleValidationError'
import { OptionalOptions } from '../../../../src/types/options'
import { FormCollection } from '../../../../src/core/FormCollection'
import { ConditionalRules } from '../../../../src/core/ConditionalRules'
import { Collection } from '../../../../src/helpers/Collection'

jest.mock('../../../../src/core/Interceptors')
jest.mock('../../../../src/factories/RuleMessageFunctionFactory')
jest.mock('../../../../src/core/FormCollection')
jest.mock('../../../../src/warn')
jest.mock('../../../../src/core/Rule')

describe('core/Form.ts - validation', (): void => {
  const createForm = (
    field: { name: string; value?: any },
    rules: (Rule | ConditionalRules)[] = [],
    options: OptionalOptions = {},
    extraField?: { name: string; value?: any }
  ): FormWithFields => {
    const rulesObject = new Rules({
      [field.name]: rules,
    })

    const form = new Form(
      '1',
      new Rules(),
      new Errors(),
      new Collection(),
      new Collection(),
      {
        submissionComplete: new Interceptors(),
        beforeSubmission: new Interceptors(),
      }
    )

    form.$addField(field.name, field.value)
    if (extraField) {
      form.$addField(extraField.name, extraField.value)
    }
    form.$assignOptions(options)
    form.$rules = rulesObject

    form.$getField = jest.fn(() => createFakeField(field.value))

    return form
  }

  afterEach(
    (): void => {
      mocked(createRuleMessageFunction).mockClear()
      mocked(warn).mockClear()
    }
  )

  it('should validate field and warn if the field not exists', async (): Promise<
    any
  > => {
    const form = createForm({ name: 'name' })

    await form.$validateField('last_name')

    expect(warn).toHaveBeenLastCalledWith(
      false,
      expect.stringContaining('last_name')
    )

    await form.$validateField('name')

    expect(warn).toHaveBeenLastCalledWith(true, expect.stringContaining('name'))
  })

  it('should validate the field and clear its previous errors', async (): Promise<
    any
  > => {
    const form = createForm({ name: 'name' })
    form.$errors.fill({
      name: ['a', 'b'],
    })

    await form.$validateField('name')

    expect(form.$errors.get('name').length).toBe(0)
  })

  it('should validate field and run over all of the rules', async (): Promise<
    any
  > => {
    const rule1 = new Rule(jest.fn())
    const rule2 = new Rule(jest.fn())

    const form = createForm({ name: 'name' }, [rule1, rule2])

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

    const form = createForm({ name: 'name' }, [rule1, rule2, rule3], {
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

  it('should set prefix to the field key in errors if the form has field prefix', async (): Promise<
    any
  > => {
    const rule = new Rule(jest.fn())

    rule.validate = jest.fn(() => {
      throw new RuleValidationError('error1')
    })

    const form = createForm({ name: 'name' }, [rule])
    form.$fieldsPrefix = 'field.0.'

    await form.$validateField('name')

    expect(form.$errors.get('name').length).toBe(0)
    expect(form.$errors.get('field.0.name').length).toBe(1)
  })

  it('should also validate the form collection if the field is a FormCollection', async (): Promise<
    any
  > => {
    const rule = new Rule(jest.fn())
    const rule2 = new Rule(jest.fn())
    const formCollection = new FormCollection()

    const form = createForm({ name: 'name', value: formCollection }, [
      rule,
      rule2,
    ])

    await form.$validateField('name')

    const getFieldResult = mocked(form.$getField).mock.results[0].value
    const defaultMessage = mocked(createRuleMessageFunction).mock.results[0]
      .value

    expect(rule.validate).toHaveBeenCalledWith(
      getFieldResult,
      form,
      defaultMessage
    )

    expect(rule2.validate).toHaveBeenCalledWith(
      getFieldResult,
      form,
      defaultMessage
    )

    expect(formCollection.validate).toHaveBeenCalledTimes(1)
  })

  it('should validate ConditionalRules rules if the condition returns true', async (): Promise<
    any
  > => {
    const rule = createFakeRule()
    const rule2 = createFakeRule()
    const conditionalRules = new ConditionalRules(() => true, [rule, rule2])

    const form = createForm({ name: 'name', value: null }, [conditionalRules])

    await form.$validateField('name')

    const getFieldResult = mocked(form.$getField).mock.results[0].value
    const defaultMessage = mocked(createRuleMessageFunction).mock.results[0]
      .value

    expect(rule.validate).toHaveBeenCalledWith(
      getFieldResult,
      form,
      defaultMessage
    )
    expect(rule2.validate).toHaveBeenCalledWith(
      getFieldResult,
      form,
      defaultMessage
    )
  })

  it('should not validate ConditionalRules rules if the condition returns true', async (): Promise<
    any
  > => {
    const rule = createFakeRule()
    const rule2 = createFakeRule()
    const conditionalRules = new ConditionalRules(() => false, [rule, rule2])

    const form = createForm({ name: 'name', value: null }, [conditionalRules])

    await form.$validateField('name')

    expect(rule.validate).not.toHaveBeenCalled()
    expect(rule2.validate).not.toHaveBeenCalled()
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

    const form = createForm({ name: 'name' }, [rule1, rule2, rule3], {
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

    const form = createForm({ name: 'name' }, [rule])

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
    const form = createForm({ name: 'name' }, [rule])

    form.$validateField('name')

    expect(form.$validating.has('name')).toBe(true)
  })

  it('should mark the field as validating and add a prefix if the form has fieldsPrefix', (): void => {
    const rule = new Rule(jest.fn())
    const form = createForm({ name: 'name' }, [rule])

    form.$fieldsPrefix = 'emails.0.'

    form.$validateField('name')

    expect(form.$validating.has('name')).toBe(false)
    expect(form.$validating.has('emails.0.name')).toBe(true)
  })

  it('should validate all the fields of the form', async (): Promise<any> => {
    const form = createForm({ name: 'name' }, [], {}, { name: 'last_name' })

    form.$validateField = jest.fn()

    await form.$validateForm()

    expect(form.$validateField).toHaveBeenNthCalledWith(1, 'name')
    expect(form.$validateField).toHaveBeenNthCalledWith(2, 'last_name')
  })

  it('should invoke $validateField or $validateForm', async () => {
    const form = createForm({ name: 'name' })

    form.$validateForm = jest.fn()
    form.$validateField = jest.fn()

    await form.$validate()

    expect(form.$validateForm).toHaveBeenCalledTimes(1)
    expect(form.$validateField).toHaveBeenCalledTimes(0)

    mocked(form.$validateForm).mockClear()
    mocked(form.$validateField).mockClear()

    await form.$validate('name')

    expect(form.$validateForm).toHaveBeenCalledTimes(0)
    expect(form.$validateField).toHaveBeenCalledWith('name')
  })

  it('should checks if validating the field', (): void => {
    const form = createForm({ name: 'name' })

    expect(form.$isValidating('name')).toBe(false)

    form.$validating.push('name')

    expect(form.$isValidating('name')).toBe(true)

    expect(warn).toHaveBeenCalledTimes(3)
    expect(warn).toHaveBeenLastCalledWith(true, expect.stringContaining('name'))
  })

  it('should check if the whole form is on validation mode', (): void => {
    const form = createForm({ name: 'name' }, [], {}, { name: 'last_name' })

    expect(form.$isValidating()).toBe(false)

    form.$validating.push('last_name')

    expect(form.$isValidating()).toBe(true)

    expect(warn).toHaveBeenCalledTimes(4)
    expect(warn).toHaveBeenLastCalledWith(true, expect.stringContaining('null'))
  })

  it('should warn if the field is not exists in the form and try to check if isValidating', (): void => {
    const form = createForm({ name: 'last_name' })

    form.$isValidating('name')

    expect(warn).toHaveBeenLastCalledWith(
      false,
      expect.stringContaining('name')
    )
  })
})
