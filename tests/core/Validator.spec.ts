import { Form } from "../../src";
import { Validator } from "../../src/core/Validator"
import defaultOptions from '../../src/defaults'

jest.mock('../../src/core/Form')

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
      passes: ({ value }) => value,
      message: ({ label, value }) => `${label} is invalid. the ${value} is incorrect`,
    }]
  }


  it('should construct as it should', () => {
    let validator = new Validator(rules, defaultOptions.validation)

    let mockFormField = { key: 'a', value: null, label: 'A' }
    let mockForm = new Form({})

    expect(validator.$rules.first_name[0].passes(mockFormField, mockForm)).toBe(true)
    expect(validator.$rules.first_name[0].message({ ...mockFormField, label: 'First Name' }, mockForm))
      .toEqual(defaultOptions.validation.defaultMessage({ ...mockFormField, label: 'First Name' }, mockForm))

    expect(validator.$rules.last_name[0].passes(mockFormField, mockForm)).toBe(false)
    expect(validator.$rules.last_name[0].message(mockFormField, mockForm)).toEqual('Invalid')

    expect(validator.$rules.last_name[1].passes(mockFormField, mockForm)).toBe(true)
    expect(validator.$rules.last_name[1].message({ ...mockFormField, label: 'Last Name' }, mockForm))
      .toEqual(defaultOptions.validation.defaultMessage({ ...mockFormField, label: 'Last Name' }, mockForm))

    expect(validator.$rules.is_developer[0].passes({ ...mockFormField, value: false }, mockForm)).toBe(false)
    expect(validator.$rules.is_developer[0].message({ ...mockFormField, label: 'Developer', value: true }, mockForm)).toEqual('Developer is invalid. the true is incorrect')
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
    let mockForm = new Form({})

    let errors = validator.validateField({ key: 'last_name', value: 'string', label: 'Last Name' }, mockForm)
    expect(errors).toHaveLength(1)
    expect(errors[0]).toBe('Invalid')

    errors = validator.validateField({ key: 'first_name', value: 'string', label: 'First Name' }, mockForm)
    expect(errors).toHaveLength(0)

    errors = validator.validateField({ key: 'is_developer', value: true, label: 'Is Developer' }, mockForm)
    expect(errors).toHaveLength(0)

    errors = validator.validateField({ key: 'is_developer', value: false, label: 'Is Developer' }, mockForm)
    expect(errors).toHaveLength(1)
    expect(errors[0]).toBe('Is Developer is invalid. the false is incorrect')
  });


  it('should call passes and message callback functions with the right params when validate', () => {
    let validator = new Validator({
      name: [ { passes: jest.fn(() => false), message: jest.fn() } ]
    }, defaultOptions.validation)
    let mockForm = new Form({})

    let fieldObj = { key: 'name', value: 'Nevo', label: 'Name' }

    validator.validateField(fieldObj, mockForm)
    expect(validator.$rules.name[0].passes).toBeCalledWith(fieldObj, mockForm)
    expect(validator.$rules.name[0].message).toBeCalledWith(fieldObj, mockForm)
  });

  it('should stop validate spesific field after the first rule was failed if the option say so', () => {
    let mockForm = new Form({})

    let validator = new Validator({
      name: [ () => false, () => false ]
    }, { ...defaultOptions.validation, stopAfterFirstRuleFailed: true })

    let errors = validator.validateField({ key: 'name', value: 'string', label: 'name' }, mockForm)
    expect(errors).toHaveLength(1)

    validator = new Validator({
      name: [ () => false, () => false ]
    }, { ...defaultOptions.validation, stopAfterFirstRuleFailed: false })

    errors = validator.validateField({ key: 'name', value: 'string', label: 'name' }, mockForm)
    expect(errors).toHaveLength(2)
  });

})
