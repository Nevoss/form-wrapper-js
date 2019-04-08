import { Form } from '../../src/core/Form'
import { RulesManager } from '../../src/core/validation/RulesManager'
import { Validator } from '../../src/core/validation/Validator'
import defaultOptions from '../../src/default-options'
import { Field } from '../../src/types/Field'
import { FieldValidationError } from '../../src/errors/FieldValidationError'
import { ValidationOptions } from '../../src/types/Options'
import { RuleValidationError } from '../../src'
import { FieldKeysCollection } from '../../src/core/FieldKeysCollection'

jest.mock('../../src/core/Form')

describe('Validator.ts', () => {
  let fakeForm: Form = new Form({})
  let defaultValidationOptions: ValidationOptions

  beforeEach(() => {
    defaultValidationOptions = { ...defaultOptions.validation }
  })

  it('should construct correctly', () => {

    let validator = new Validator(defaultValidationOptions)

    expect(validator.$validating).toBeInstanceOf(FieldKeysCollection)
  })

  it('should return a resolved promise if fieldKey is not exists', () => {
    const validator = new Validator(defaultValidationOptions)

    let fakeField: Field = { key: 'a', label: 'a', value: 'a' }
    let response = validator.validateField([], fakeField, fakeForm)

    expect(response).toResolve()
  })

  it('should returns a resolved promise if all the rules passes in validateField method', async () => {
    const passesMock1 = jest.fn(() => true)
    const passesMock2 = jest.fn(() => true)
    const passesMock3 = jest.fn(() => Promise.resolve())

    let rulesManager = new RulesManager(
      {
        name: [
          passesMock1,
          passesMock2,
          { passes: passesMock3, returnsPromise: true },
        ],
      },
      defaultValidationOptions.defaultMessage
    )

    const validator = new Validator(defaultValidationOptions)

    const field: Field = { key: 'name', value: 'a', label: 'a' }

    const response = await validator.validateField(
      rulesManager.get('name'),
      field,
      fakeForm
    )

    expect(response).toBe(field)

    expect(passesMock1).toHaveBeenCalledWith(field, fakeForm)
    expect(passesMock2).toHaveBeenCalledWith(field, fakeForm)
    expect(passesMock3).toHaveBeenCalledWith(field, fakeForm)
    expect(validator.$validating.has('name')).toBe(false)
  })

  it('should returns rejected promise if one of the validation message failed', async () => {
    const passesMock1 = jest.fn(() => true)
    const passesMock2 = jest.fn(() => false)
    const passesMock3 = jest.fn(() => false)

    defaultValidationOptions.stopAfterFirstRuleFailed = false

    const ruleManager = new RulesManager(
      {
        name: [
          passesMock1,
          { passes: passesMock2, message: 'aaa' },
          { passes: passesMock3, message: 'bbb' },
        ],
      },
      defaultValidationOptions.defaultMessage
    )

    const validator = new Validator(defaultValidationOptions)

    expect.assertions(6)

    const field: Field = { key: 'name', value: 'a', label: 'a' }
    try {
      await validator.validateField(ruleManager.get('name'), field, fakeForm)
    } catch (e) {
      expect(e).toBeInstanceOf(FieldValidationError)
      expect(e.messages).toEqual(['aaa', 'bbb'])
    }

    expect(passesMock1).toHaveBeenCalledWith(field, fakeForm)
    expect(passesMock2).toHaveBeenCalledWith(field, fakeForm)
    expect(passesMock3).toHaveBeenCalledWith(field, fakeForm)
    expect(validator.$validating.has('name')).toBe(false)
  })

  it('should stop validating the other `passes` functions if the first function failed and the options are set to do so', async () => {
    const passesMock1 = jest.fn(({ value }) => {
      if (value === 'a') {
        return Promise.reject(new RuleValidationError())
      }

      return Promise.resolve()
    })
    const passesMock2 = jest.fn(() => true)

    defaultValidationOptions.stopAfterFirstRuleFailed = true

    const ruleManager = new RulesManager(
      {
        name: [
          {
            passes: passesMock1,
            message: ({ label }) => `${label} invalid`,
            returnsPromise: true,
          },
          passesMock2,
        ],
      },
      defaultValidationOptions.defaultMessage
    )

    const validator = new Validator(defaultValidationOptions)

    const field: Field = { key: 'name', value: 'a', label: 'a' }

    expect.assertions(5)

    try {
      await validator.validateField(ruleManager.get('name'), field, fakeForm)
    } catch (e) {
      expect(e).toBeInstanceOf(FieldValidationError)
      expect(e.messages).toEqual(['a invalid'])
    }

    expect(passesMock1).toHaveBeenCalledWith(field, fakeForm)
    expect(passesMock2).toHaveBeenCalledTimes(0)
    expect(validator.$validating.has('name')).toBe(false)
  })

  it('should bubble up the error if the error is not RuleValidationError', async () => {
    const passesMock1 = jest.fn(() => {
      throw new Error('Error!!')
    })
    const passesMock2 = jest.fn(() => true)

    defaultValidationOptions.stopAfterFirstRuleFailed = false

    const ruleManager = new RulesManager(
      {
        name: [passesMock1, passesMock2],
      },
      defaultValidationOptions.defaultMessage
    )

    const validator = new Validator(defaultValidationOptions)

    const field: Field = { key: 'name', value: 'a', label: 'a' }

    try {
      await validator.validateField(ruleManager.get('name'), field, fakeForm)
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
      expect(e.message).toBe('Error!!')
    }

    expect(passesMock1).toHaveBeenCalledWith(field, fakeForm)
    expect(passesMock2).toHaveBeenCalledTimes(0)
    expect(validator.$validating.has('name')).toBe(false)
  })

  it('should add the fieldKey to $validation collection if the field is on validation ', () => {
    const ruleManager = new RulesManager(
      { name: [() => true] },
      defaultValidationOptions.defaultMessage
    )

    const validator = new Validator(defaultValidationOptions)

    const field: Field = { key: 'name', value: 'a', label: 'a' }

    expect(validator.$validating.has('name')).toBe(false)

    validator.validateField(ruleManager.get('name'), field, fakeForm)

    expect(validator.$validating.has('name')).toBe(true)
  })
})
