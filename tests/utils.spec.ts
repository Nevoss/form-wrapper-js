import { isObject, warn } from '../src/utils'

describe('utils.js', () => {
  it('should determine if value is object', () => {
    expect(isObject({})).toBe(true)
    expect(isObject(() => {})).toBe(false)
    expect(isObject([])).toBe(false)
    expect(isObject(1)).toBe(false)
    expect(isObject('aa')).toBe(false)
  })

  it('should console.error an error message', () => {
    warn('random error message')

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(
      '[Form-wrapper-js warn]: random error message'
    )
  })
})
