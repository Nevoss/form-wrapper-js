import createRuleMessage from '../../../src/factories/RuleMessageFunctionFactory'
import { Form } from '../../../src/core/Form'

jest.mock('../../../src/core/Form')

describe('factories/RuleMessageFunctionFactory.ts', (): void => {
  it('should returns the function as is if the argument is an RuleMessageFunction', (): void => {
    const messageFunc = jest.fn()

    const resultMessageFunc = createRuleMessage(messageFunc)

    expect(resultMessageFunc).toBe(messageFunc)
  })

  it('should returns a function if the argument is a string', (): void => {
    const messageString = 'This is an error!'

    const resultMessageFunc = createRuleMessage(messageString)

    expect(typeof resultMessageFunc === 'function').toBe(true)
    expect(
      resultMessageFunc(
        { label: 'a', value: 'a', extras: 'a', key: 'a' },
        Form.create()
      )
    ).toBe(messageString)
  })
})
