import { isObject, warn, debounce, uniqueId } from '../src/utils'

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

  it('should debounce the method', () => {
    jest.useFakeTimers()

    let callback = jest.fn()

    let debouncedCallback = debounce(callback, 2000)
    debouncedCallback('argument1', 2)

    expect(callback).toHaveBeenCalledTimes(0)

    jest.runAllTimers()

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('argument1', 2)
  })

  it('should generate a good enough unique id', () => {
    const id = uniqueId()

    expect(id).toBeString()
    expect(id.length).toBeGreaterThan(12)
  })
})
