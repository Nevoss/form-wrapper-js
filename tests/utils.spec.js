import { isObject, mergeDeep } from "../src/utils";

describe('utils.js', () => {


  it('should determine if value is object', () => {
    expect(isObject({})).toBe(true)
    expect(isObject(() => {})).toBe(false)
    expect(isObject([])).toBe(false)
    expect(isObject(1)).toBe(false)
    expect(isObject('aa')).toBe(false)
  });


  it('should merge deep 2 objects', () => {
    expect(mergeDeep(
      { a: 1, b: { c: 3, d: 4 }, e: 5 },
      { a: 'a', b: { d: 'd' } }
    )).toEqual({
      a: 'a', b: { c: 3, d: 'd' }, e: 5
    })
  });
})
