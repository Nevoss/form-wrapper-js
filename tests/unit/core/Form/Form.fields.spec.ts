import { Form } from '../../../../src/core/Form'
import { Rules } from '../../../../src/core/Rules'
import warn from '../../../../src/warn'
import generateFieldDeclaration from '../../../../src/helpers/generateFieldDeclaration'
import { FieldDeclaration } from '../../../../src/types/fields'
import { createFakeFieldDeclaration } from '../../../fake-data'
import { mocked } from 'ts-jest/utils'
import { FormCollection } from '../../../../src/core/FormCollection'

jest.mock('../../../../src/core/Rules')
jest.mock('../../../../src/warn')
jest.mock('../../../../src/helpers/generateFieldDeclaration', () =>
  jest.fn((): FieldDeclaration => createFakeFieldDeclaration())
)

describe('core/Form.ts - Fields', (): void => {
  beforeEach(
    (): void => {
      mocked(warn).mockClear()
      mocked(generateFieldDeclaration).mockClear()
      mocked(Rules).mockClear()
    }
  )

  it('should check if field is exists in the form', (): void => {
    const form = Form.create()

    form.$addField('name', null)

    expect(form.$hasField('name')).toBe(true)
    expect(form.$hasField('last_name')).toBe(false)
  })

  it('should add field to the form', (): void => {
    const form = Form.create()

    form.$addField('name', 'Nevo')

    const fakeFieldDeclaration = mocked(generateFieldDeclaration).mock
      .results[0].value

    expect(warn).toHaveBeenCalledWith(true, expect.stringContaining('name'))
    expect(generateFieldDeclaration).toHaveBeenCalledWith('name', 'Nevo')
    expect(form.name).toBe(fakeFieldDeclaration.value)
    expect(form.$initialValues.name).toBe(fakeFieldDeclaration.value)
    expect(form.$extra.name).toBe(fakeFieldDeclaration.extra)
    expect(form.$labels.name).toBe(fakeFieldDeclaration.label)
    expect(form.$rules.generateFieldRules).toHaveBeenCalledWith(
      'name',
      fakeFieldDeclaration.rules
    )
  })

  it('should add field with a type of FormCollection', (): void => {
    const form = Form.create()

    mocked(generateFieldDeclaration).mockImplementationOnce(
      (): any => createFakeFieldDeclaration(true)
    )

    const valuesSpy = jest.spyOn(FormCollection.prototype, 'values')

    form.$addField('emails', FormCollection.create())

    const fakeFieldDeclaration = mocked(generateFieldDeclaration).mock
      .results[0].value

    expect(form.emails).toBe(fakeFieldDeclaration.value)
    expect(valuesSpy).toHaveBeenCalled()
    expect(form.$initialValues.emails).toEqual(
      fakeFieldDeclaration.value.values()
    )
  })

  it('should warn if try to add field that exist in the form', (): void => {
    const form = Form.create()

    form.$addField('name', null)
    form.$addField('name', 'a')

    expect(warn).toHaveBeenLastCalledWith(
      false,
      expect.stringContaining('name')
    )
  })

  it('should add number of fields to the form', (): void => {
    const form = Form.create()

    form.$addField = jest.fn()

    form.$addFields({
      name: 'a',
      last_name: 'b',
    })

    expect(form.$addField).toHaveBeenCalledTimes(2)
    expect(form.$addField).toHaveBeenNthCalledWith(1, 'name', 'a')
    expect(form.$addField).toHaveBeenNthCalledWith(2, 'last_name', 'b')
  })

  it('should remove a field from the form', (): void => {
    const form = Form.create({
      name: 'a',
    })

    form.$removeField('name')

    expect(warn).toHaveBeenCalledWith(true, expect.stringContaining('name'))
    expect(form.hasOwnProperty('name')).toBe(false)
    expect(form.$initialValues.hasOwnProperty('name')).toBe(false)
    expect(form.$extra.hasOwnProperty('name')).toBe(false)
    expect(form.$labels.hasOwnProperty('name')).toBe(false)
    expect(form.$rules.unset).toHaveBeenCalledWith('name')
  })

  it('should warn if try to remove field that not exist in the form', (): void => {
    const form = Form.create()

    form.$removeField('name')

    expect(warn).toHaveBeenLastCalledWith(
      false,
      expect.stringContaining('name')
    )
  })

  it('should remove number of fields from the form', (): void => {
    const form = Form.create({
      name: null,
      last_name: null,
    })

    form.$removeField = jest.fn()

    form.$removeFields(['name', 'last_name'])

    expect(form.$removeField).toHaveBeenCalledTimes(2)
    expect(form.$removeField).toHaveBeenNthCalledWith(1, 'name')
    expect(form.$removeField).toHaveBeenNthCalledWith(2, 'last_name')
  })

  it('should return all the field keys of the Form', (): void => {
    const form = Form.create({
      name: null,
      a: null,
    })

    expect(form.$getFields()).toEqual(['name', 'a'])
  })

  it('should return a Field object', (): void => {
    const form = Form.create({
      name: null,
    })

    const nameFakeData = mocked(generateFieldDeclaration).mock.results[0].value

    expect(form.$getField('name')).toEqual(
      expect.objectContaining({
        key: 'name',
        label: nameFakeData.label,
        value: nameFakeData.value,
        extra: nameFakeData.extra,
      })
    )
    expect(form.$getField('name').extra).toBe(nameFakeData.extra)
  })
})
