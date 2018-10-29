import { Validator } from "../../src/core/Validator"
import defaultOptions from '../../src/defaults'

describe('Validator.js', () => {

  let rules = {
    first_name: [() => true],
    last_name: [
      {
        passes: () => false,
        message: 'Invalid'
      },
      () => true
    ],
    is_developer: [{
      passes: (value) => value,
      message: ({ label, value }) => `${label} is invalid. the ${value} is incorrect`,
    }]
  }


  it('should construct as it should', () => {
    let validator = new Validator(rules, defaultOptions.validation)
    
    expect(validator.$rules.first_name[0].passes()).toBe(true)
    expect(validator.$rules.first_name[0].message({ label: 'First Name' })).toEqual(defaultOptions.validation.defaultMessage({ label: 'First Name' }))

    expect(validator.$rules.last_name[0].passes()).toBe(false)
    expect(validator.$rules.last_name[0].message()).toEqual('Invalid')

    expect(validator.$rules.last_name[1].passes()).toBe(true)
    expect(validator.$rules.last_name[1].message({ label: 'Last Name' })).toEqual(defaultOptions.validation.defaultMessage({ label: 'Last Name' }))

    expect(validator.$rules.is_developer[0].passes(false)).toBe(false)
    expect(validator.$rules.is_developer[0].message({ label: 'Developer', value: true })).toEqual('Developer is invalid. the true is incorrect')
  });


  it('should deterime if has rule', () => {
    let validator = new Validator(rules, defaultOptions.validation)

    expect(validator.has('first_name')).toBe(true)
    expect(validator.has('last_name')).toBe(true)
    expect(validator.has('is_developer')).toBe(true)
    expect(validator.has('other')).toBe(false)
  });


  it('should get the rules of the field key that requested', () => {
    let validator = new Validator(rules, defaultOptions.validation)

    expect(validator.get('first_name')).toBeInstanceOf(Array)
    expect(validator.get('last_name')).toBeInstanceOf(Array)
    expect(validator.get('other')).toBe(undefined)
  });


  it('should validate specific field', () => {
    let validator = new Validator(rules, defaultOptions.validation)

    let errors = validator.validateField('last_name', 'string')
    expect(errors).toHaveLength(1)
    expect(errors[0]()).toBe('Invalid')

    errors = validator.validateField('first_name', 'string')
    expect(errors).toHaveLength(0)

    errors = validator.validateField('is_developer', true)
    expect(errors).toHaveLength(0)

    errors = validator.validateField('is_developer', false)
    expect(errors).toHaveLength(1)
    expect(errors[0]({ label: 'Is Developer', value: false })).toBe('Is Developer is invalid. the false is incorrect')
  });


  it('should validate all form field rules', () => {
    let validator = new Validator(rules, defaultOptions.validation)
    validator.validateField = jest.fn(() => [])

    let errors = validator.validate({ first_name: 'a', last_name: 'b', is_developer: false })

    expect(errors).toHaveProperty('first_name')
    expect(errors).toHaveProperty('last_name')
    expect(errors).toHaveProperty('is_developer')

    expect(errors.first_name).toEqual([])
    expect(errors.last_name).toEqual([])
    expect(errors.is_developer).toEqual([])

    expect(validator.validateField.mock.calls).toHaveLength(3)
    expect(validator.validateField.mock.calls[0][0]).toBe('first_name')
    expect(validator.validateField.mock.calls[1][0]).toBe('last_name')
    expect(validator.validateField.mock.calls[2][0]).toBe('is_developer')
  });

})
