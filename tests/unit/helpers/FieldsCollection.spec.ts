import { FieldsCollection } from '../../../src/helpers/FieldsCollection'
import { Items } from '../../../src/types/helpers'

describe('core/helpers/FieldsCollection.ts', (): void => {
  // Creates a mock fields for testing
  const createFields = (): Items<string> => ({
    name: 'nevo',
    last_name: 'golan',
  })

  it('should fill the items object with new items', (): void => {
    const fieldsCollection = new FieldsCollection()

    const fields = createFields()

    fieldsCollection.fill(fields)

    expect(fieldsCollection.all()).toEqual(fields)
  })

  it('should fill the items object when constructing the object', (): void => {
    jest.spyOn(FieldsCollection.prototype, 'fill')

    const fields = createFields()

    const fieldsCollection = new FieldsCollection(fields)

    expect(fieldsCollection.fill).toHaveBeenCalledWith(fields)
  })

  it('should merge items to the items object', (): void => {
    const fields = createFields()

    const fieldsCollection = new FieldsCollection(fields)

    const newFields = { is_developer: 'string' }

    fieldsCollection.merge(newFields)

    expect(fieldsCollection.all()).toEqual({
      ...fields,
      ...newFields,
    })
  })

  it('checks if key is exists in the items object', (): void => {
    const fieldsCollection = new FieldsCollection(createFields())

    expect(fieldsCollection.has('name')).toBe(true)
    expect(fieldsCollection.has('is_developer')).toBe(false)
  })

  it('should gets the key value', (): void => {
    const fieldsCollection = new FieldsCollection(createFields())

    expect(fieldsCollection.get('name', null)).toBe('nevo')
    expect(fieldsCollection.get('is_developer', null)).toBe(null)
    expect(fieldsCollection.get('is_developer', 'no')).toBe('no')
  })

  it('checks if there is any key in items object', (): void => {
    const fieldsCollection = new FieldsCollection()

    expect(fieldsCollection.any()).toBe(false)

    fieldsCollection.fill(createFields())

    expect(fieldsCollection.any()).toBe(true)
  })

  it('should delete item from the items object if exists', (): void => {
    const fields = createFields()

    const fieldsCollection = new FieldsCollection(fields)

    fieldsCollection.unset('is_developer')
    expect(fieldsCollection.all()).toEqual(fields)

    fieldsCollection.unset('name')
    expect(fieldsCollection.all()).toEqual({
      last_name: 'golan',
    })
  })

  it('should clear the items object', (): void => {
    const fieldsCollection = new FieldsCollection(createFields())

    fieldsCollection.clear()

    expect(fieldsCollection.any()).toBe(false)
  })
})
