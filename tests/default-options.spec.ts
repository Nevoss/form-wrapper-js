import { Form } from '../src/core/Form'
import defaultOptions from '../src/default-options'
import { Field } from '../src/types/Field'

jest.mock('../src/core/Form')

describe('default-options.ts', () => {
  it('should be a function that returns string (validation.defaultMessage)', () => {
    const fakeForm = new Form({})
    const field: Field = { label: 'a', key: 'b', value: 'c' }

    // @ts-ignore
    const result = defaultOptions.validation.defaultMessage(field, fakeForm)

    expect(result).toBe('a is invalid.')
  })
})
