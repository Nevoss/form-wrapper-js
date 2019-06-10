import defaultOptions from '../../src/default-options'
import { createFakeField } from '../fake-data'
import { Form } from '../../src/core/Form'

jest.mock('../../src/core/Form')

describe('default-options.ts', (): void => {
  it('should return a default message when calling the defaultMessage option', (): void => {
    const field = createFakeField()
    const form = Form.create()

    expect.assertions(2)

    expect(typeof defaultOptions.validation.defaultMessage !== 'string').toBe(
      true
    )

    if (typeof defaultOptions.validation.defaultMessage !== 'string') {
      expect(defaultOptions.validation.defaultMessage(field, form)).toEqual(
        expect.stringContaining(field.label)
      )
    }
  })
})
