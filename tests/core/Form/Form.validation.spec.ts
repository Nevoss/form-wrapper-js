import { Form } from '../../../src/core/Form'
import { FieldValidationError } from '../../../src/errors/FieldValidationError'
import * as utils from '../../../src/utils'
import { mocked } from 'ts-jest/utils'

jest.mock('../../../src/core/Errors')
jest.mock('../../../src/core/FieldKeysCollection')

describe('Form.validation.ts', () => {
  it('should validate specific field', async () => {
    let form = new Form({
      name: {
        value: 'a',
        label: 'The Name',
        rules: [() => true],
      },
    })

    form.$validator.validateField = jest.fn(() =>
      Promise.reject(new FieldValidationError(['error']))
    )

    await form.$validateField('name')

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

    mocked(form.$errors.push).mockClear()
    mocked(form.$errors.unset).mockClear()

    form.$validator.validateField = jest.fn(() => Promise.resolve())

    await form.$validateField('name')
    expect(form.$errors.push).toHaveBeenCalledTimes(0)
    expect(form.$errors.unset).toHaveBeenCalledTimes(1)
    expect(form.$errors.unset).toBeCalledWith('name')
  })

  it('should warn if trying to validate field and the field is not exists', async () => {
    const warnSpy = jest.spyOn(utils, 'warn')

    let form = new Form({ name: null })

    await form.$validateField('first_name')

    expect(warnSpy).toHaveBeenCalledTimes(1)
    warnSpy.mockClear()
  })

  it('should validate all the fields of the form', async () => {
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

    form.$validateField = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve())
      .mockReturnValueOnce(Promise.resolve())

    await form.$validateAll()

    expect(form.$validateField).toHaveBeenNthCalledWith(1, 'name')
    expect(form.$validateField).toHaveBeenNthCalledWith(2, 'last_name')
  })

  it('should call to validate specific field or all the fields', async () => {
    let form = new Form({ first_name: null })

    form.$validateAll = jest.fn()
    form.$validateField = jest.fn()

    await form.$validate()

    expect(form.$validateAll).toHaveBeenCalledTimes(1)
    expect(form.$validateField).toHaveBeenCalledTimes(0)

    mocked(form.$validateAll).mockClear()
    mocked(form.$validateField).mockClear()

    await form.$validate('first_name')

    expect(form.$validateAll).toHaveBeenCalledTimes(0)
    expect(form.$validateField).toHaveBeenCalledTimes(1)
  })

  it('should bubble up errors that are not FieldValidationError on validateField method', async () => {
    let form = new Form({ name: null })

    form.$validator.validateField = jest.fn(() => {
      throw new Error('error')
    })

    expect.assertions(2)

    try {
      await form.$validateField('name')
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
      expect(e.message).toBe('error')
    }
  })

  it('should checks if validating the field', () => {
    let form = new Form({ name: null })

    form.$validator.$validating.has = jest.fn(() => true)

    expect(form.$isValidating('name')).toBe(true)
    expect(form.$validator.$validating.has).toHaveBeenCalledWith('name')

    form.$validator.$validating.has = jest.fn(() => false)

    expect(form.$isValidating('name')).toBe(false)
    expect(form.$validator.$validating.has).toHaveBeenCalledWith('name')
  })

  it('should check if the whole form is on validation mode', () => {
    let form = new Form({ name: null })

    form.$validator.$validating.any = jest.fn(() => true)

    expect(form.$isValidating()).toBe(true)
    expect(form.$validator.$validating.any).toHaveBeenCalledTimes(1)

    form.$validator.$validating.any = jest.fn(() => false)

    expect(form.$isValidating()).toBe(false)
    expect(form.$validator.$validating.any).toHaveBeenCalledTimes(1)
  })

  it('should warn if the field is not exists in the initial fields', () => {
    let warnSpy = jest.spyOn(utils, 'warn')

    let form = new Form({ name: null })

    form.$isValidating('loYodea')

    expect(warnSpy).toHaveBeenCalledTimes(1)
    warnSpy.mockClear()
  })
})
