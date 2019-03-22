import defaultOptions from '../../src/default-options'
import { RulesManager } from '../../src/core/RulesManager'
import { Rule } from '../../src/core/Rule'
import { ValidationOptions } from '../../src/types/Options'
import generateMessageFunction from '../../src/helpers/generateMessageFunction'

jest.mock('../../src/helpers/generateMessageFunction', () => {
  return {
    __esModule: true,
    default: jest.fn(() => () => {}),
  }
})

describe('RulesManager.ts', () => {
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
    let buildFieldRule = jest.spyOn(RulesManager.prototype, 'buildFieldRules')

    let rulesManager = new RulesManager(
      rules,
      defaultValidationOptions.defaultMessage
    )

    expect(rulesManager.get('first_name')).toHaveLength(1)
    expect(rulesManager.get('last_name')).toHaveLength(2)
    expect(rulesManager.get('is_developer')).toHaveLength(3)

    expect(generateMessageFunction).toHaveBeenNthCalledWith(
      1,
      defaultValidationOptions.defaultMessage
    )

    expect(buildFieldRule).toHaveBeenCalledTimes(3)

    let callNumber: number = 1
    Object.keys(rulesManager.all()).forEach(fieldKey => {
      expect(buildFieldRule).toHaveBeenNthCalledWith(
        callNumber,
        fieldKey,
        rules[fieldKey]
      )
      callNumber++
    })
  })

  it('should determine if has rule', () => {
    let rulesManager = new RulesManager(
      rules,
      defaultValidationOptions.defaultMessage
    )

    expect(rulesManager.has('first_name')).toBe(true)
    expect(rulesManager.has('last_name')).toBe(true)
    expect(rulesManager.has('is_developer')).toBe(true)
    expect(rulesManager.has('other')).toBe(false)
  })

  it('should get the rules of the field key that requested', () => {
    let rulesManager = new RulesManager(
      rules,
      defaultValidationOptions.defaultMessage
    )

    expect(rulesManager.get('first_name')).toBeInstanceOf(Array)
    expect(rulesManager.get('last_name')).toBeInstanceOf(Array)
    expect(rulesManager.get('other')).toBe(undefined)
  })

  it('should returns all the fields rules', () => {
    let rulesManager = new RulesManager(
      rules,
      defaultValidationOptions.defaultMessage
    )

    let fieldsRules = rulesManager.all()

    expect(Object.keys(fieldsRules)).toEqual([
      'first_name',
      'last_name',
      'is_developer',
    ])

    Object.keys(fieldsRules).forEach(function(fieldKey) {
      expect(fieldsRules[fieldKey]).toBeArray()
    })
  })

  it('should build field rules correctly', () => {
    let rulesManager = new RulesManager(
      rules,
      defaultValidationOptions.defaultMessage
    )

    let buildFromRawValueSpy = jest.spyOn(Rule, 'buildFromRawValue')

    let newRules = [
      () => true,
      {
        passes: () => false,
        message: 'a',
      },
    ]

    rulesManager.buildFieldRules('name', newRules)

    expect(buildFromRawValueSpy).toHaveBeenCalledTimes(2)
    expect(rulesManager.get('name')).toHaveLength(2)

    let callNumber: number = 1

    rulesManager.get('name').forEach((rule, index) => {
      expect(rule).toBeInstanceOf(Rule)
      expect(buildFromRawValueSpy).toHaveBeenNthCalledWith(
        callNumber,
        newRules[index],
        expect.toBeFunction()
      )

      callNumber++
    })
  })
})
