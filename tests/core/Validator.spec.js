import { Form } from "../../src/core/Form";
import { Validator } from "../../src/core/Validator"
import defaultOptions from '../../src/defaults'

jest.mock('../../src/core/Form')

describe('Validator.js', () => {

  beforeEach(() => {
    Form.mockClear()
  })


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
    
    expect(validator.$rules.first_name[0].passes()).toBe(true)
    expect(validator.$rules.first_name[0].message({ label: 'First Name' })).toEqual(defaultOptions.validation.defaultMessage({ label: 'First Name' }))

    expect(validator.$rules.last_name[0].passes()).toBe(false)
    expect(validator.$rules.last_name[0].message()).toEqual('Invalid')

    expect(validator.$rules.last_name[1].passes()).toBe(true)
    expect(validator.$rules.last_name[1].message({ label: 'Last Name' })).toEqual(defaultOptions.validation.defaultMessage({ label: 'Last Name' }))

    expect(validator.$rules.is_developer[0].passes({ value: false })).toBe(false)
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
    let mockForm = new Form()

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
    let mockForm = new Form()

    let fieldObj = { key: 'name', value: 'Nevo', label: 'Name' }
    
    validator.validateField(fieldObj, mockForm)
    expect(validator.$rules.name[0].passes).toBeCalledWith(fieldObj, mockForm)
    expect(validator.$rules.name[0].message).toBeCalledWith(fieldObj, mockForm)
  });

})
