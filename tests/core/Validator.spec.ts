import { Form } from '../../src/core/Form'
import { Validator } from '../../src/core/Validator'
import defaultOptions from '../../src/default-options'
import { Rule } from '../../src/core/Rule'
import { Field } from '../../src/types/Field'
import { FieldValidationError } from '../../src/errors/FieldValidationError'
import { ValidationOptions } from '../../src/types/Options'
import { RuleValidationError } from '../../src'

jest.mock('../../src/core/Form')

describe('Validator.js', () => {
  let fakeForm: Form = new Form({})
  let defaultValidationOptions: ValidationOptions
  let rules = {
    first_name: [() => true],
    last_name: [
      {
        passes: () => false,
        message: 'Invalid',
      },
      () => true,
    ],
    is_developer: [
      {
        passes: ({ value }) => value,
        message: ({ label, value }) =>
          `${label} is invalid. the ${value} is incorrect`,
      },
      {
        passes: () => Promise.resolve(),
        returnsPromise: true,
      },
      {
        passes: () => Promise.reject(),
        returnsPromise: true,
      },
    ],
  }

  beforeEach(() => {
    defaultValidationOptions = { ...defaultOptions.validation }
  })

  it('should construct correctly', () => {
    let buildFromRawValueSpy = jest.spyOn(Rule, 'buildFromRawValue')

    defaultValidationOptions.defaultMessage = 'This is try'

    let validator = new Validator(rules, defaultValidationOptions)

    expect(Object.keys(validator.$rules)).toEqual([
      'first_name',
      'last_name',
      'is_developer',
    ])

    expect(validator.$rules.first_name).toHaveLength(1)
    expect(validator.$rules.last_name).toHaveLength(2)
    expect(validator.$rules.is_developer).toHaveLength(3)

    expect(buildFromRawValueSpy).toHaveBeenCalledTimes(6)

    let callNumber: number = 1
    Object.keys(validator.$rules).forEach(fieldKey => {
      validator.$rules[fieldKey].forEach((rule, index) => {
        expect(rule).toBeInstanceOf(Rule)
        expect(buildFromRawValueSpy).toHaveBeenNthCalledWith(
          callNumber,
          rules[fieldKey][index],
          expect.toBeFunction()
        )
        callNumber++
      })
    })
  })

  it('should determine if has rule', () => {
    let validator = new Validator(rules, defaultOptions.validation)

    expect(validator.has('first_name')).toBe(true)
    expect(validator.has('last_name')).toBe(true)
    expect(validator.has('is_developer')).toBe(true)
    expect(validator.has('other')).toBe(false)
  })

  it('should get the rules of the field key that requested', () => {
    let validator = new Validator(rules, defaultOptions.validation)

    expect(validator.get('first_name')).toBeInstanceOf(Array)
    expect(validator.get('last_name')).toBeInstanceOf(Array)
    expect(validator.get('other')).toBe(undefined)
  })

  it('should return a resolved promise if fieldkey is not exists', () => {
    const validator = new Validator(
      { name: [() => true] },
      defaultValidationOptions
    )

    let fakeField: Field = { key: 'a', label: 'a', value: 'a' }
    let response = validator.validateField(fakeField, fakeForm)

    expect(response).toResolve()
  })

  it('should returns a resolved promise if all the rules passes in validateField method', async () => {
    const passesMock1 = jest.fn(() => true)
    const passesMock2 = jest.fn(() => true)
    const passesMock3 = jest.fn(() => Promise.resolve())

    const validator = new Validator(
      {
        name: [
          passesMock1,
          passesMock2,
          { passes: passesMock3, returnsPromise: true },
        ],
      },
      defaultValidationOptions
    )

    const field: Field = { key: 'name', value: 'a', label: 'a' }

    const response = await validator.validateField(field, fakeForm)

    expect(response).toBe(field)

    expect(passesMock1).toHaveBeenCalledWith(field, fakeForm)
    expect(passesMock2).toHaveBeenCalledWith(field, fakeForm)
    expect(passesMock3).toHaveBeenCalledWith(field, fakeForm)
  })

  it('should returns rejected promise if one of the validation message failed', async () => {
    const passesMock1 = jest.fn(() => true)
    const passesMock2 = jest.fn(() => false)
    const passesMock3 = jest.fn(() => false)

    defaultValidationOptions.stopAfterFirstRuleFailed = false

    const validator = new Validator(
      {
        name: [
          passesMock1,
          { passes: passesMock2, message: 'aaa' },
          { passes: passesMock3, message: 'bbb' },
        ],
      },
      defaultValidationOptions
    )

    expect.assertions(5)

    const field: Field = { key: 'name', value: 'a', label: 'a' }
    try {
      await validator.validateField(field, fakeForm)
    } catch (e) {
      expect(e).toBeInstanceOf(FieldValidationError)
      expect(e.messages).toEqual(['aaa', 'bbb'])
    }

    expect(passesMock1).toHaveBeenCalledWith(field, fakeForm)
    expect(passesMock2).toHaveBeenCalledWith(field, fakeForm)
    expect(passesMock3).toHaveBeenCalledWith(field, fakeForm)
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

    const validator = new Validator(
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
      defaultValidationOptions
    )

    const field: Field = { key: 'name', value: 'a', label: 'a' }

    expect.assertions(4)

    try {
      await validator.validateField(field, fakeForm)
    } catch (e) {
      expect(e).toBeInstanceOf(FieldValidationError)
      expect(e.messages).toEqual(['a invalid'])
    }

    expect(passesMock1).toHaveBeenCalledWith(field, fakeForm)
    expect(passesMock2).toHaveBeenCalledTimes(0)
  })

  it('should bubble up the error if the error is not RuleValidationError', async () => {
    const passesMock1 = jest.fn(() => {
      throw new Error('Error!!')
    })
    const passesMock2 = jest.fn(() => true)

    defaultValidationOptions.stopAfterFirstRuleFailed = false

    const validator = new Validator(
      {
        name: [passesMock1, passesMock2],
      },
      defaultValidationOptions
    )

    const field: Field = { key: 'name', value: 'a', label: 'a' }

    try {
      await validator.validateField(field, fakeForm)
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
      expect(e.message).toBe('Error!!')
    }

    expect(passesMock1).toHaveBeenCalledWith(field, fakeForm)
    expect(passesMock2).toHaveBeenCalledTimes(0)
  })
})
