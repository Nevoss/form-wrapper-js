import { Form } from '../../../src/core/Form'
import * as utils from '../../../src/utils'

jest.mock('../../../src/core/validation/RulesManager')

describe('Form.fields.ts', () => {
  it('should add new field with native value to the form fields', () => {
    const form = new Form()

    form.$addField('name', 'Nevo')

    expect(form['name']).toEqual('Nevo')
    expect(form.$labels['name']).toBe('Name')
  })

  it('should add new field with FieldOptions as value', () => {
    const rules = [jest.fn(() => true)]
    const extra = { options: [] }

    const form = new Form()

    form.$addField('name', {
      value: 'Nevo',
      label: 'This is name',
      rules,
      extra,
    })

    expect(form['name']).toBe('Nevo')
    expect(form.$labels['name']).toBe('This is name')
    expect(form.$rules.buildFieldRules).toHaveBeenCalledWith('name', rules)
    expect(form.$extra['name']).toBe(extra)
  })

  it('should warn if trying to add an existed field', () => {
    const warnMock = jest.spyOn(utils, 'warn')

    const form = new Form({
      name: null,
    })

    form.$addField('name', null)

    expect(warnMock).toHaveBeenCalledTimes(1)
    warnMock.mockClear()
  })

  it('should add an object of fields to the form', () => {
    const form = new Form()
    form.$addField = jest.fn()

    const lastNameFieldOption = {
      value: null,
      label: 'The last name',
    }

    form.$addFields({
      first_name: null,
      last_name: lastNameFieldOption,
    })

    expect(form.$addField).toHaveBeenNthCalledWith(1, 'first_name', null)
    expect(form.$addField).toHaveBeenNthCalledWith(
      2,
      'last_name',
      lastNameFieldOption
    )
  })

  it('should remove field from the form', () => {
    const form = new Form({
      first_name: null,
      last_name: null,
    })

    form.$removeField('first_name')

    expect(form.$hasField('first_name')).toBe(false)
    expect(form.$initialValues.hasOwnProperty('first_name')).toBe(false)
    expect(form.$extra.hasOwnProperty('first_name')).toBe(false)
    expect(form.$rules.unset).toBeCalledWith('first_name')
  })

  it('should warn if trying to remove an un existed field', () => {
    const warnMock = jest.spyOn(utils, 'warn')

    const form = new Form()

    form.$removeField('name')

    expect(warnMock).toHaveBeenCalledTimes(1)
    warnMock.mockClear()
  })

  it('should remove number of fields', () => {
    const form = new Form({
      name: null,
      last_name: null,
    })

    form.$removeField = jest.fn()

    form.$removeFields(['name', 'last_name'])

    expect(form.$removeField).toHaveBeenNthCalledWith(1, 'name')
    expect(form.$removeField).toHaveBeenNthCalledWith(2, 'last_name')
  })
})
