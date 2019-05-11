import { Errors } from '../../../src/core/Errors'

describe('core/Errors.ts', (): void => {
  it('should return the first error from the fields errors', (): void => {
    const errors = new Errors({
      name: ['field is required', 'field must be al least 2 chars'],
    })

    expect(errors.getFirst('name')).toBe('field is required')
  })

  it('should returns default value if there is no errors to the field', (): void => {
    const errors = new Errors()

    expect(errors.getFirst('name', 'no errors!')).toBe('no errors!')
  })

  it('should returns all the field errors', (): void => {
    const nameErrors = ['error1', 'error2']

    const errors = new Errors({ name: nameErrors })

    expect(errors.get('name')).toBe(nameErrors)
  })

  it('should returns an empty array if the field has no errors', (): void => {
    const errors = new Errors()

    expect(errors.get('name')).toEqual([])
  })
})
