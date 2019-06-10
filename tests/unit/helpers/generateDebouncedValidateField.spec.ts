import generateDebouncedValidateField from '../../../src/helpers/generateDebouncedValidateField'
import * as utils from '../../../src/utils'
import { Form } from '../../../src/core/Form'
import { mocked } from 'ts-jest/utils'

jest.mock('../../../src/utils', () => {
  return {
    debounce: jest.fn((): Function => (): void => {}),
    isObject: (): boolean => false,
    uniqueId: (): string => '123',
  }
})

describe('generateDebouncedValidateField.ts', (): void => {
  it('should generate a debounced version of validate field method', (): void => {
    // Mock it just to quickly resolve a problem with the Form constructor
    // and the mock of the utils.
    Form.prototype.$addFields = jest.fn()

    let form = Form.create()

    Function.prototype.bind = jest.fn(function(): any {
      // @ts-ignore
      return this
    })

    form.$options.validation.debouncedValidateFieldTime = 500

    let result = generateDebouncedValidateField(form)

    expect(utils.debounce).toHaveBeenLastCalledWith(form.$validateField, 500)

    // the index of the results is 1 because index 0 is the first call of debounce
    // the call that was in the Form.create method
    expect(result).toBe(mocked(utils.debounce).mock.results[1].value)
  })
})
