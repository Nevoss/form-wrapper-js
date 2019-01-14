import { mocked } from 'ts-jest/utils'
import { Rule } from '../../src/core/Rule'
import { MessageFunction, PassesFunction } from '../../src/types/Errors'
import generatePassesFunction from '../../src/helpers/generatePassesFunction'
import { RawRule } from '../../src/types/Validator'
import generateMessageFunction from '../../src/helpers/generateMessageFunction'

jest.mock('../../src/helpers/generatePassesFunction', () => ({
  __esModule: true,
  default: jest.fn(() => 'generatePassesFunction fake value'),
}))

jest.mock('../../src/helpers/generateMessageFunction', () => ({
  __esModule: true,
  default: jest.fn(() => 'generateMessageFunction fake value'),
}))

describe('Rule.ts', () => {
  let fakeDefaultMessage: MessageFunction = () => 'example'

  beforeEach(() => {
    mocked(generatePassesFunction).mockClear()
    mocked(generatePassesFunction).mockClear()
  })

  it('should construct correctly', () => {
    const passes: PassesFunction = () => new Promise(resolve => resolve())
    const message: MessageFunction = () => 'Good!'
    const rawValue = () => true

    const rule = new Rule(passes, message, rawValue)

    expect(rule.passes).toBe(passes)
    expect(rule.message).toBe(message)
    expect(rule.$rawValue).toBe(rawValue)
  })

  it('should build Rule class with basic function', () => {
    const rawValue = () => false

    const rule = Rule.buildFromRawValue(rawValue, fakeDefaultMessage)

    expect(generateMessageFunction).toHaveBeenCalledTimes(0)

    expect(generatePassesFunction).toHaveBeenCalledTimes(1)
    expect(generatePassesFunction).toHaveBeenLastCalledWith(rawValue)
    expect(rule.passes).toBe('generatePassesFunction fake value')

    expect(rule.message).toBe(fakeDefaultMessage)

    expect(rule.$rawValue).toBe(rawValue)
  })

  it('should build Rule class with RawRule object that passes prop NOT returns promise', () => {
    const passes = () => true
    const rawValue: RawRule = {
      passes,
    }

    const rule = Rule.buildFromRawValue(rawValue, fakeDefaultMessage)

    expect(generateMessageFunction).toHaveBeenCalledTimes(0)

    expect(generatePassesFunction).toHaveBeenCalledTimes(1)
    expect(generatePassesFunction).toHaveBeenLastCalledWith(passes)
    expect(rule.passes).toBe('generatePassesFunction fake value')

    expect(rule.message).toBe(fakeDefaultMessage)

    expect(rule.$rawValue).toBe(rawValue)
  })

  it('should build Rule class with RawRule object that passes prop IS returning promise', () => {
    const passes = () => new Promise(resolve => resolve())
    const rawValue: RawRule = {
      passes,
      returnsPromise: true,
    }

    const rule = Rule.buildFromRawValue(rawValue, fakeDefaultMessage)

    expect(generateMessageFunction).toHaveBeenCalledTimes(0)

    expect(generatePassesFunction).toHaveBeenCalledTimes(0)
    expect(rule.passes).toBe(passes)

    expect(rule.message).toBe(fakeDefaultMessage)

    expect(rule.$rawValue).toBe(rawValue)
  })

  it('should build Rule class and generate a message from the message prop that provided', () => {
    const message = 'this is a message'
    const rawValue: RawRule = {
      passes: () => true,
      message,
    }

    const rule = Rule.buildFromRawValue(rawValue, fakeDefaultMessage)

    expect(generateMessageFunction).toHaveBeenCalledTimes(1)
    expect(generateMessageFunction).toBeCalledWith(message)
    expect(rule.message).toBe('generateMessageFunction fake value')

    expect(generatePassesFunction).toHaveBeenCalledTimes(1)

    expect(rule.$rawValue).toBe(rawValue)
  })
})
