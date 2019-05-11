import warn from '../../src/warn'
import { mocked } from 'ts-jest/utils'

describe('warn.ts', (): void => {
  beforeEach(
    (): void => {
      jest.spyOn(console, 'warn').mockImplementation((): void => {})
    }
  )

  afterEach(
    (): void => {
      mocked(console.warn).mockRestore()
    }
  )

  it('should not log a warning if the condition is true', (): void => {
    warn(true, 'message')
    expect(console.warn).not.toHaveBeenCalled()
  })

  it('should log a warning if the condition is falsy', () => {
    const message = 'message'
    warn(false, message)

    expect(console.warn).toHaveBeenCalledWith(
      '[Form-wrapper-js warn]: ' + message
    )
  })
})
