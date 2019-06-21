import { Form } from '../../../../src'
import { FormCollection } from '../../../../src/core/FormCollection'
import { mocked } from 'ts-jest/utils'
import warn from '../../../../src/warn'
import * as utils from '../../../../src/utils'

jest.mock('../../../../src/warn')

describe('core/Form.ts - values', (): void => {
  it('should return all the form values as an object', (): void => {
    const form = Form.create({
      name: {
        value: null,
        transformer: {
          reverseTransform: value => `${value} +`,
        },
      },
      last_name: null,
      emails: FormCollection.create({
        email: null,
        type: null,
      }),
    })

    form.emails.values = jest.fn((): [] => [])

    form.name = 'Nevo'
    form.last_name = 'Golan'

    const result = form.$values()

    expect(result).toEqual({
      name: 'Nevo +',
      last_name: 'Golan',
      emails: [],
    })
    expect(form.emails.values).toHaveBeenCalledTimes(1)
    expect(result.emails).toBe(mocked(form.emails.values).mock.results[0].value)
  })

  it('should return all the form values as an object without transformers', () => {
    const form = Form.create({
      name: {
        value: null,
        transformer: {
          reverseTransform: value => `${value} +`,
        },
      },
    })

    form.name = 'Nevo'

    expect(form.$values(false)).toEqual({
      name: 'Nevo',
    })
  })

  it('should return all the form values as FormData object', (): void => {
    const objectToFormDataSpy = jest.spyOn(utils, 'objectToFormData')

    const form = Form.create()

    const values = form.$valuesAsFormData()

    expect(objectToFormDataSpy).toHaveBeenCalledWith(
      expect.objectContaining(form.$values())
    )
    expect(values).toBe(objectToFormDataSpy.mock.results[0].value)
  })

  it('should return form values as JSON', (): void => {
    const form = Form.create({
      first_name: 'Nevo',
      last_name: null,
    })

    const valueAsJson = form.$valuesAsJson()

    expect(valueAsJson).toBe(JSON.stringify(form.$values()))
  })

  it('should fill all the form values with new values', (): void => {
    const form = Form.create({
      name: {
        value: null,
        transformer: {
          transform: value => `${value} +`,
        },
      },
      last_name: null,
      emails: FormCollection.create({
        email: null,
        type: null,
      }),
    })

    const emailsFillSpy = jest.spyOn(form.emails, 'fill')

    const newEmails = [{ email: 'a', type: 'a' }]

    form.$fill({
      name: 'Nevo',
      emails: newEmails,
      fake_field: null,
    })

    expect(form.name).toBe('Nevo +')
    expect(form.last_name).toBe(null)
    expect(emailsFillSpy).toHaveBeenCalledWith(newEmails, false, true)
    expect(form.$hasField('fake_field')).toBe(false)
  })

  it('should fill all the form values with new values and not to call the transformers', (): void => {
    const form = Form.create({
      name: {
        value: null,
        transformer: {
          transform: value => `${value} +`,
        },
      },
      emails: FormCollection.create({
        email: null,
        type: null,
      }),
    })

    const emailsFillSpy = jest.spyOn(form.emails, 'fill')

    const newEmails = [{ email: 'a', type: 'a' }]

    form.$fill(
      {
        name: 'Nevo',
        emails: newEmails,
      },
      false,
      false
    )

    expect(form.name).toBe('Nevo')
    expect(emailsFillSpy).toHaveBeenCalledWith(newEmails, false, false)
  })

  it('should fill the form with values and update the initial values', (): void => {
    const form = Form.create({
      name: null,
      last_name: 'a',
      emails: FormCollection.create({
        email: null,
        type: null,
      }),
    })

    const emailsFillSpy = jest.spyOn(form.emails, 'fill')

    const newEmails = [{ email: 'a', type: 'a' }]

    form.$fill(
      {
        name: 'Nevo',
        emails: newEmails,
      },
      true
    )

    expect(form.$initialValues['name']).toBe('Nevo')
    expect(form.$initialValues['last_name']).toBe('a')
    expect(form.$initialValues['emails']).toEqual(newEmails)
    expect(emailsFillSpy).toHaveBeenCalledWith(newEmails, true, true)
  })

  it('should reset all the values of the form to the initial form values', (): void => {
    const initialValues = {
      first_name: 'Nevo',
      last_name: null,
      is_developer: true,
    }

    const form = Form.create(initialValues)

    form.$fill = jest.fn()

    form.first_name = 'AA'
    form.last_name = 'Golan'

    form.$resetValues()

    expect(form.$fill).toHaveBeenLastCalledWith(initialValues)
  })

  it('should determine if field is dirty (was different than the $initialValues)', (): void => {
    const form = Form.create({
      first_name: 'Nevo',
      is_developer: true,
    })

    form.is_developer = false

    expect(form.$isFieldDirty('first_name')).toBe(false)
    expect(warn).toHaveBeenLastCalledWith(
      true,
      expect.stringContaining('first_name')
    )
    expect(form.$isFieldDirty('another_field')).toBe(false)
    expect(warn).toHaveBeenLastCalledWith(
      false,
      expect.stringContaining('another_field')
    )
    expect(form.$isFieldDirty('is_developer')).toBe(true)
  })

  it('should determine if FormCollection field is dirty', (): void => {
    const form = Form.create({
      emails: FormCollection.create({ email: null }),
      phones: FormCollection.create({ phone: null }),
    })

    const emailsIsDirtySpy = jest.spyOn(form.emails, 'isDirty')
    const phonesIsDirtySpy = jest.spyOn(form.phones, 'isDirty')

    form.emails.add()

    expect(form.$isFieldDirty('emails')).toBe(true)
    expect(emailsIsDirtySpy).toHaveBeenCalled()

    expect(form.$isFieldDirty('phones')).toBe(false)
    expect(phonesIsDirtySpy).toHaveBeenCalled()
  })

  it('should determine if the whole form is dirty', (): void => {
    const form = Form.create({
      first_name: 'Nevo',
      is_developer: true,
    })

    expect(form.$isFormDirty()).toBe(false)

    form.first_name = 'AA'

    expect(form.$isFormDirty()).toBe(true)
  })

  it('should checks if field is dirty when field key is passed as an argument', (): void => {
    const form = Form.create({ name: null })

    form.$isFieldDirty = jest.fn()
    form.$isFormDirty = jest.fn()

    form.$isDirty('name')

    expect(form.$isFieldDirty).toHaveBeenCalledWith('name')
    expect(form.$isFormDirty).not.toHaveBeenCalled()
  })

  it('should checks if the whole form is dirty when field key is not passed as an argument', (): void => {
    const form = Form.create({ name: null })

    form.$isFieldDirty = jest.fn()
    form.$isFormDirty = jest.fn()

    form.$isDirty()

    expect(form.$isFieldDirty).not.toHaveBeenCalled()
    expect(form.$isFormDirty).toHaveBeenCalled()
  })
})
