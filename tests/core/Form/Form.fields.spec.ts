import { Form } from '../../../src/core/Form'
import { mocked } from 'ts-jest/utils'

jest.mock('../../../src/core/RulesManager')

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
})
