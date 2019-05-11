import { FieldKeysCollection } from '../../../src/helpers/FieldKeysCollection'

describe('core/helpers/fieldKeysCollection.ts', (): void => {
  it('should returns all the field keys array', (): void => {
    let fieldKeysCollection = new FieldKeysCollection()
    fieldKeysCollection.keys = ['a', 'b']

    expect(fieldKeysCollection.all()).toEqual(['a', 'b'])
  })

  it('should fill keys', (): void => {
    let fieldKeysCollection = new FieldKeysCollection()
    fieldKeysCollection.fill(['a', 'b'])

    expect(fieldKeysCollection.all()).toEqual(['a', 'b'])
  })

  it('should check if key is exists', (): void => {
    let fieldKeysCollection = new FieldKeysCollection()
    fieldKeysCollection.fill(['a', 'b'])

    expect(fieldKeysCollection.has('a')).toBe(true)
    expect(fieldKeysCollection.has('b')).toBe(true)
    expect(fieldKeysCollection.has('c')).toBe(false)
  })

  it('should add key to the keys', (): void => {
    let fieldKeysCollection = new FieldKeysCollection()
    fieldKeysCollection.fill(['a', 'b'])

    fieldKeysCollection.push('c')
    fieldKeysCollection.push('c')

    expect(fieldKeysCollection.all()).toEqual(['a', 'b', 'c'])
  })

  it('should clear all the keys', (): void => {
    let fieldKeysCollection = new FieldKeysCollection()
    fieldKeysCollection.fill(['a', 'b'])

    fieldKeysCollection.clear()

    expect(fieldKeysCollection.all()).toEqual([])
  })

  it('should check if there is any key', (): void => {
    let fieldKeysCollection = new FieldKeysCollection()

    expect(fieldKeysCollection.any()).toBe(false)

    fieldKeysCollection.fill(['a', 'b'])

    expect(fieldKeysCollection.any()).toBe(true)
  })

  it('should unset key from the keys', (): void => {
    let fieldKeysCollection = new FieldKeysCollection()
    fieldKeysCollection.fill(['a', 'b'])

    fieldKeysCollection.unset('a')

    expect(fieldKeysCollection.all()).toEqual(['b'])

    fieldKeysCollection.unset('c')

    expect(fieldKeysCollection.all()).toEqual(['b'])
  })
})
