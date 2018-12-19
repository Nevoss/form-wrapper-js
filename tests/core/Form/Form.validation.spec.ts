import { Form } from '../../../src/core/Form'
import * as utils from '../../../src/utils'

jest.mock('../../../src/core/Errors')
jest.mock('../../../src/core/Validator')
jest.mock('../../../src/core/Touched')

describe('Form.validation.ts', () => {
  it('should validate specific field', () => {
    let form = new Form({
      name: {
        value: 'a',
        label: 'The Name',
        rules: [() => true],
      },
    })

    form.$validator.validateField = jest.fn(() => ['error'])

    let isValid = form.validateField('name')

    expect(isValid).toBe(false)
    expect(form.$errors.unset).toHaveBeenCalledTimes(1)
    expect(form.$errors.unset).toBeCalledWith('name')
    expect(form.$errors.push).toHaveBeenCalledTimes(1)
    expect(form.$errors.push).toBeCalledWith({
      name: ['error'],
    })
    expect(form.$validator.validateField).toBeCalledWith(
      { label: 'The Name', value: 'a', key: 'name' },
      form
    )

    form.$validator.validateField = jest.fn(() => [])

    isValid = form.validateField('name')
    expect(isValid).toBe(true)
    expect(form.$errors.push).toHaveBeenCalledTimes(1)
    expect(form.$errors.unset).toHaveBeenCalledTimes(2)
  })

  it('should warn if trying to validate field and the field is not exists', () => {
    let warnMock = jest.spyOn(utils, 'warn')

    let form = new Form({ name: null })

    form.validateField('first_name')

    expect(warnMock).toHaveBeenCalledTimes(1)
  })

  it('should validate all the fields of the form', () => {
    let form = new Form({
      name: {
        value: null,
        rules: [() => true],
      },
      last_name: {
        value: null,
        rules: [() => false],
      },
    })

    form.validateField = jest
      .fn()
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)

    expect(form.validateAll()).toBe(true)
    expect(form.validateField).toHaveBeenNthCalledWith(1, 'name')
    expect(form.validateField).toHaveBeenNthCalledWith(2, 'last_name')

    form.validateField = jest
      .fn()
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
    expect(form.validateAll()).toBe(false)
  })

  it('should call to validate specific field or all the fields', () => {
    let form = new Form({ first_name: null })

    form.validateAll = jest.fn()
    form.validateField = jest.fn()

    form.validate()

    expect(form.validateAll).toHaveBeenCalledTimes(1)
    expect(form.validateField).not.toHaveBeenCalled()

    form.validate('first_name')

    expect(form.validateAll).toHaveBeenCalledTimes(1)
    expect(form.validateField).toHaveBeenCalledTimes(1)
  })
})
