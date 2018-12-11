import { isObject } from '../src/utils'

describe('utils.js', () => {
  it('should determine if value is object', () => {
    expect(isObject({})).toBe(true)
    expect(isObject(() => {})).toBe(false)
    expect(isObject([])).toBe(false)
    expect(isObject(1)).toBe(false)
    expect(isObject('aa')).toBe(false)
  })
})
