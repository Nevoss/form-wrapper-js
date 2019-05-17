import createRuleMessage from '../../../src/factories/RuleMessageFunctionFactory'
import { Form } from '../../../src/core/Form'
import { createFakeField } from '../../fake-data'

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
    expect(resultMessageFunc(createFakeField(), Form.create())).toBe(
      messageString
    )
  })
})
