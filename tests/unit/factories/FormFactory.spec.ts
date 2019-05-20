import createForm from '../../../src/factories/FormFactory'
import { Form } from '../../../src/core/Form'

describe('factories/FormFactory.ts', (): void => {
  it('should create a Form', (): void => {
    const fields = {}
    const options = {}

    jest.spyOn(Form.prototype, '$assignOptions')
    jest.spyOn(Form.prototype, '$addFields')

    const form = createForm(fields, options)

    expect(form).toBeInstanceOf(Form)
    expect(form.$assignOptions).toHaveBeenCalledWith(options)
    expect(form.$addFields).toHaveBeenCalledWith(fields)
  })
})
