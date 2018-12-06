import { Touched } from '../../src/core/Touched'

describe('Touched.ts', () => {
  it('should returns all the touched array', () => {
    let touched = new Touched()
    touched.$touched = ['a', 'b']

    expect(touched.all()).toEqual(['a', 'b'])
  })

  it('should record touched fields', () => {
    let touched = new Touched()
    touched.record(['a', 'b'])

    expect(touched.all()).toEqual(['a', 'b'])
  })

  it('should check if field key is touched', () => {
    let touched = new Touched()
    touched.record(['a', 'b'])

    expect(touched.has('a')).toBe(true)
    expect(touched.has('b')).toBe(true)
    expect(touched.has('c')).toBe(false)
  })

  it('should add field to the touched array', () => {
    let touched = new Touched()
    touched.record(['a', 'b'])

    touched.push('c')
    touched.push('c')

    expect(touched.all()).toEqual(['a', 'b', 'c'])
  })

  it('should clear all the touched array', () => {
    let touched = new Touched()
    touched.record(['a', 'b'])

    touched.clear()

    expect(touched.all()).toEqual([])
  })

  it('should check if there is any field touched', () => {
    let touched = new Touched()

    expect(touched.any()).toBe(false)

    touched.record(['a', 'b'])

    expect(touched.any()).toBe(true)
  })

  it('should unset field from the touched array', () => {
    let touched = new Touched()
    touched.record(['a', 'b'])

    touched.unset('a')

    expect(touched.all()).toEqual(['b'])
  })
})
