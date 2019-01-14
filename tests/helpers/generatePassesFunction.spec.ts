import generatePassesFunction from '../../src/helpers/generatePassesFunction'
import { Form } from '../../src/core/Form'
import { Field } from '../../src/types/Field'
import * as utils from '../../src/utils'
import { RuleValidationError } from '../../src'

describe('generatePassesFunction.ts', () => {
  let fakeForm: Form = new Form({})
  let fakeField: Field = { key: 'a', value: 'a', label: 'a' }
  let warnSpy = jest.spyOn(utils, 'warn')

  beforeEach(() => {
    warnSpy.mockClear()
  })

  it('should generate PassesFunction', () => {
    const argument = () => true

    expect(generatePassesFunction(argument)).toBeInstanceOf(Function)
  })

  it('should warn if the first argument is not a function', () => {
    const argument = 1

    // @ts-ignore
    generatePassesFunction(argument)

    expect(warnSpy).toHaveBeenCalledTimes(1)
  })

  it('should return resolved promise if the argument function returns true', () => {
    const argument = () => true

    const response = generatePassesFunction(argument)(fakeField, fakeForm)

    expect(response).toBeInstanceOf(Promise)
    expect(response).toResolve()

    expect(warnSpy).toHaveBeenCalledTimes(0)
  })

  it('should returns rejected promise if the argument function returns false', () => {
    const argument = () => false

    const response = generatePassesFunction(argument)(fakeField, fakeForm)

    expect(response).toBeInstanceOf(Promise)
    expect(response).toReject()
    expect(response).rejects.toBeInstanceOf(RuleValidationError)

    expect(warnSpy).toHaveBeenCalledTimes(0)
  })

  it('should warn if the argument returns promise.', () => {
    const argument = () => Promise.resolve()

    generatePassesFunction(argument)(fakeField, fakeForm)

    expect(warnSpy).toHaveBeenCalledTimes(1)
  })
})
