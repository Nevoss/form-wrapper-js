import {
  setSubmittingToFalse,
  clearForm,
} from '../../../src/interceptors/submissionComplete'
import { OptionalOptions } from '../../../src/types/options'
import { FormWithFields } from '../../../src/types/form'
import { Form } from '../../../src'
import { Rules } from '../../../src/core/Rules'
import { Errors } from '../../../src/core/Errors'
import { Interceptors } from '../../../src/core/Interceptors'
import { Collection } from '../../../src/helpers/Collection'

describe('interceptors/submissionComplete.ts', (): void => {
  const createForm = (options: OptionalOptions = {}): FormWithFields => {
    const form = new Form(
      '1',
      new Rules(),
      new Errors(),
      new Collection(),
      new Collection(),
      {
        submissionComplete: new Interceptors(),
        beforeSubmission: new Interceptors(),
      }
    )

    form.$assignOptions(options)

    return form
  }

  it('should set form $submitting prop to false on successful submission', async (): Promise<
    any
  > => {
    const response = {}
    const form = createForm()
    form.$submitting = true

    const result = await setSubmittingToFalse.fulfilled({ form, response })

    expect(result.response).toBe(response)
    expect(result.form).toBe(form)
    expect(form.$submitting).toBe(false)
  })

  it('should set form $submitting prop to false on UN successful submission', async (): Promise<
    any
  > => {
    const error = {}
    const form = createForm()
    form.$submitting = true

    expect.assertions(3)

    try {
      await setSubmittingToFalse.rejected({ form, error })
    } catch (e) {
      expect(e.form).toBe(form)
      expect(e.error).toBe(error)
      expect(e.form.$submitting).toBe(false)
    }
  })

  it('should clear the form errors if the option is set as true', async (): Promise<
    any
  > => {
    const form = createForm({
      successfulSubmission: {
        clearErrors: true,
        clearTouched: false,
        resetValues: false,
      },
    })

    form.$errors.clear = jest.fn()
    form.$touched.clear = jest.fn()
    form.$resetValues = jest.fn()

    await clearForm.fulfilled({ form, response: null })

    expect(form.$errors.clear).toHaveBeenCalled()
    expect(form.$touched.clear).not.toHaveBeenCalled()
    expect(form.$resetValues).not.toHaveBeenCalled()
  })

  it('should clear the form touched if the option is set as true', async (): Promise<
    any
  > => {
    const form = createForm({
      successfulSubmission: {
        clearErrors: false,
        clearTouched: true,
        resetValues: false,
      },
    })

    form.$errors.clear = jest.fn()
    form.$touched.clear = jest.fn()
    form.$resetValues = jest.fn()

    await clearForm.fulfilled({ form, response: null })

    expect(form.$errors.clear).not.toHaveBeenCalled()
    expect(form.$touched.clear).toHaveBeenCalled()
    expect(form.$resetValues).not.toHaveBeenCalled()
  })

  it('should rest form values if the option is set as true', async (): Promise<
    any
  > => {
    const form = createForm({
      successfulSubmission: {
        clearErrors: false,
        clearTouched: false,
        resetValues: true,
      },
    })

    form.$errors.clear = jest.fn()
    form.$touched.clear = jest.fn()
    form.$resetValues = jest.fn()

    await clearForm.fulfilled({ form, response: null })

    expect(form.$errors.clear).not.toHaveBeenCalled()
    expect(form.$touched.clear).not.toHaveBeenCalled()
    expect(form.$resetValues).toHaveBeenCalled()
  })
})
