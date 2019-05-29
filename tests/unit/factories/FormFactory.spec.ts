import createForm from '../../../src/factories/FormFactory'
import createInterceptors from '../../../src/factories/InterceptorsFactory'
import * as utils from '../../../src/utils'
import { Form } from '../../../src/core/Form'
import { mocked } from 'ts-jest/utils'
import { Errors } from '../../../src/core/Errors'
import { Rules } from '../../../src/core/Rules'
import { Collection } from '../../../src/helpers/Collection'

jest.mock('../../../src/factories/InterceptorsFactory', () =>
  jest.fn(() => {
    return {}
  })
)

describe('factories/FormFactory.ts', (): void => {
  afterEach(
    (): void => {
      mocked(createInterceptors).mockClear()
    }
  )

  it('should create a form without any arguments', (): void => {
    const form = createForm()

    expect(form).toBeInstanceOf(Form)
  })

  it('should create a Form', (): void => {
    const fields = {}
    const options = {}

    jest.spyOn(Form.prototype, '$assignOptions')
    jest.spyOn(Form.prototype, '$addFields')
    const uniqueIdSpy = jest
      .spyOn(utils, 'uniqueId')
      .mockImplementation((): string => '123123')

    const form = createForm(fields, options)

    expect(form).toBeInstanceOf(Form)
    expect(uniqueIdSpy).toHaveBeenCalled()
    expect(form.$id).toBe(uniqueIdSpy.mock.results[0].value)
    expect(form.$assignOptions).toHaveBeenCalledWith(options)
    expect(form.$addFields).toHaveBeenCalledWith(fields)
    expect(createInterceptors).toHaveBeenCalled()
    expect(form.$interceptors).toBe(
      mocked(createInterceptors).mock.results[0].value
    )
  })

  it('should create the form with the dependencies that provided', (): void => {
    const errors = new Errors()
    const rules = new Rules()
    const touched = new Collection<string>()
    const validating = new Collection<string>()

    const form = createForm(
      {},
      {},
      {
        validating,
        touched,
        errors,
        rules,
      }
    )

    expect(form.$errors).toBe(errors)
    expect(form.$rules).toBe(rules)
    expect(form.$touched).toBe(touched)
    expect(form.$validating).toBe(validating)
  })
})
