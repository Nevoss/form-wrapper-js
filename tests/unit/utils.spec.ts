import { uniqueId, isObject, debounce, objectToFormData } from '../../src/utils'

describe('utils.js', (): void => {
  it('should generate a good enough unique id', (): void => {
    const id = uniqueId()

    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(12)
  })

  it('should determine if value is object', (): void => {
    expect(isObject({})).toBe(true)
    expect(isObject((): any => {})).toBe(false)
    expect(isObject([])).toBe(false)
    expect(isObject(1)).toBe(false)
    expect(isObject('aa')).toBe(false)
  })

  it('should debounce the method', (): void => {
    jest.useFakeTimers()

    let callback = jest.fn()

    let debouncedCallback = debounce(callback, 2000)
    debouncedCallback('argument1', 2)

    expect(callback).toHaveBeenCalledTimes(0)

    jest.runAllTimers()

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('argument1', 2)
  })

  it('should transform object to FormData', (): void => {
    const file = new File([''], 'filename')

    const object = {
      name: null,
      first_name: 'Nevo',
      last_name: undefined,
      is_developer: false,
      file,
      emails: [{ email: 'a', type: 'b' }, { email: 'c', type: 'd' }],
    }

    const result: FormData = objectToFormData(object)

    expect(result.has('name')).toBe(false)
    expect(result.has('last_name')).toBe(false)
    expect(result.has('is_developer')).toBe(false)
    expect(result.get('first_name')).toBe('Nevo')
    expect(result.get('file')).toBe(file)
    expect(result.get('emails[0][email]')).toBe('a')
    expect(result.get('emails[0][type]')).toBe('b')
    expect(result.get('emails[1][email]')).toBe('c')
    expect(result.get('emails[1][type]')).toBe('d')
  })
})
