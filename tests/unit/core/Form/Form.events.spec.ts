import { Form } from '../../../../src/core/Form'
import warn from '../../../../src/warn'
import { mocked } from 'ts-jest/utils'

jest.mock('../../../../src/warn')
jest.mock('../../../../src/core/Errors')
jest.mock('../../../../src/helpers/Collection')

describe('core/Form.ts - events', (): void => {
  it('should validate field that was change if the "validation.onFieldChanged" set as true', (): void => {
    let form = Form.create(
      { first_name: null },
      {
        validation: {
          onFieldChanged: true,
        },
      }
    )

    form.$debouncedValidateField = jest.fn()

    form.$fieldChanged('first_name')

    expect(form.$debouncedValidateField).toHaveBeenCalledTimes(1)
    expect(form.$debouncedValidateField).toHaveBeenCalledWith('first_name')

    form.$assignOptions({
      validation: {
        onFieldChanged: false,
      },
    })

    form.$debouncedValidateField = jest.fn()

    form.$fieldChanged('first_name')

    expect(form.$debouncedValidateField).toHaveBeenCalledTimes(0)
  })

  it('should clear field errors after field changed', (): void => {
    let form = Form.create(
      { first_name: null },
      {
        validation: {
          unsetFieldErrorsOnFieldChange: false,
        },
      }
    )

    form.$fieldChanged('first_name')

    expect(form.$errors.unset).toHaveBeenCalledTimes(0)

    form.$assignOptions({
      validation: {
        unsetFieldErrorsOnFieldChange: true,
      },
    })

    form.$fieldChanged('first_name')

    expect(form.$errors.unset).toHaveBeenCalledTimes(1)
    expect(form.$errors.unset).toHaveBeenCalledWith('first_name')
  })

  it('should push to touched and set $onFocus when field is on focus', () => {
    let form = Form.create({ first_name: null })

    form.$fieldFocused('first_name')

    expect(form.$onFocus).toBe('first_name')
    expect(form.$touched.push).toHaveBeenCalledTimes(1)
    expect(form.$touched.push).toHaveBeenCalledWith('first_name')
  })

  it('should reset $onFocus if the field is on focus, and validate the field if "validation.onFieldBlurred" is set', () => {
    let form = Form.create(
      { first_name: null, last_name: null },
      {
        validation: {
          onFieldBlurred: false,
        },
      }
    )

    form.$validateField = jest.fn()
    form.$onFocus = 'first_name'

    form.$fieldBlurred('first_name')

    expect(form.$onFocus).toBe(null)
    expect(form.$validateField).toHaveBeenCalledTimes(0)

    form.$assignOptions({
      validation: {
        onFieldBlurred: true,
      },
    })
    form.$onFocus = 'last_name'
    form.$fieldBlurred('first_name')

    expect(form.$onFocus).toBe('last_name')
    expect(form.$validateField).toHaveBeenCalledTimes(1)
    expect(form.$validateField).toHaveBeenCalledWith('first_name')
  })

  it('should warn if field not exists in fieldBlurred, fieldChanged and fieldFocused methods', () => {
    let form = Form.create()

    form.$fieldChanged('some_field_1')
    expect(warn).toBeCalledWith(false, expect.stringContaining('some_field_1'))

    mocked(warn).mockClear()

    form.$fieldBlurred('some_field_2')
    expect(warn).toBeCalledWith(false, expect.stringContaining('some_field_2'))

    mocked(warn).mockClear()

    form.$fieldFocused('some_field_3')
    expect(warn).toBeCalledWith(false, expect.stringContaining('some_field_3'))
  })
})
