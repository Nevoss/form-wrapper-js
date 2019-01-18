import generateMessageFunction from '../../src/helpers/generateMessageFunction'
import * as utils from '../../src/utils'

describe('generateMessageFunction.ts', () => {
  it('should return the same function if the argument is already MessageFunction', () => {
    const argument = () => `This is message`

    expect(generateMessageFunction(argument)).toBe(argument)
  })

  it('should generate MessageFunction if the argument is string', () => {
    const argument = 'this is message too'

    const messageFunctionResult = generateMessageFunction(argument)

    expect(messageFunctionResult).toBeInstanceOf(Function)
    expect(messageFunctionResult()).toBe(argument)
  })

  it('should warn if the arguments is not a string or function', () => {
    let warnMock = jest.spyOn(utils, 'warn')
    const argument = 1

    // @ts-ignore
    generateMessageFunction(argument)

    expect(warnMock).toHaveBeenCalledTimes(1)
  })
})
