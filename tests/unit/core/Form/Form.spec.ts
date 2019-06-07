import { Form } from '../../../../src/core/Form'
import generateOptions from '../../../../src/helpers/generateOptions'
import generateDebouncedValidateField from '../../../../src/helpers/generateDebouncedValidateField'
import defaultOptions from '../../../../src/default-options'
import { mocked } from 'ts-jest/utils'
import { createFakeOptions } from '../../../fake-data'

jest.mock('../../../../src/helpers/generateOptions', () =>
  jest.fn(() => createFakeOptions())
)
jest.mock('../../../../src/helpers/generateDebouncedValidateField', () =>
  jest.fn(() => {})
)

describe('core/Form.ts', (): void => {
  afterEach(
    (): void => {
      mocked(generateOptions).mockClear()
      mocked(generateDebouncedValidateField).mockClear()
    }
  )

  it('should assign default options', (): void => {
    const options = {}

    Form.assignDefaultOptions(options)

    expect(generateOptions).toHaveBeenCalledWith(defaultOptions, options)
    expect(Form.defaults.options).toBe(
      mocked(generateOptions).mock.results[0].value
    )
  })

  it('should create a Form object', (): void => {
    const createSpy = jest.spyOn(Form, 'create')

    const fields = {}
    const options = {}

    const form = Form.create(fields, options)

    expect(createSpy).toHaveBeenCalledWith(fields, options)
    expect(form).toBeInstanceOf(Form)
    expect(form).toBe(mocked(createSpy).mock.results[0].value)
  })

  it('should assign options to the Form object', (): void => {
    const options = {}

    const form = Form.create()

    form.$assignOptions(options)

    expect(generateOptions).toHaveBeenLastCalledWith(defaultOptions, options)
    expect(generateDebouncedValidateField).toHaveBeenLastCalledWith(form)
    expect(form.$options).toBe(mocked(generateOptions).mock.results[1].value)
    expect(form.$debouncedValidateField).toBe(
      mocked(generateDebouncedValidateField).mock.results[1].value
    )
  })

  it('should reset all the Form state', (): void => {
    const form = Form.create()

    const clearErrorsSpy = jest.spyOn(form.$errors, 'clear')
    const clearTouchedSpy = jest.spyOn(form.$touched, 'clear')
    const resetValuesSpy = jest.spyOn(form, '$resetValues')

    form.$reset()

    expect(clearErrorsSpy).toHaveBeenNthCalledWith(1)
    expect(clearTouchedSpy).toHaveBeenNthCalledWith(1)
    expect(resetValuesSpy).toHaveBeenNthCalledWith(1)
  })
})
