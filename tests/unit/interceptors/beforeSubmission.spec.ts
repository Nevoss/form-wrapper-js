import {
  setSubmittingToTrue,
  validateForm,
} from '../../../src/interceptors/beforeSubmission'
import { Form } from '../../../src/core/Form'
import { Rules } from '../../../src/core/Rules'
import { Errors } from '../../../src/core/Errors'
import { Interceptors } from '../../../src/core/Interceptors'
import { FormWithFields } from '../../../src/types/form'
import { OptionalOptions } from '../../../src/types/options'

jest.mock('../../../src/core/Rules')
jest.mock('../../../src/core/Errors')
jest.mock('../../../src/core/Interceptors')

describe('interceptors/beforeSubmission.ts', (): void => {
  const createForm = (options: OptionalOptions = {}): FormWithFields => {
    const form = new Form('1', new Rules(), new Errors(), {
      submissionComplete: new Interceptors(),
      beforeSubmission: new Interceptors(),
    })

    form.$assignOptions(options)

    return form
  }

  it('should validate the form before submission and return valid promise', async (): Promise<
    any
  > => {
    const form = createForm({
      validation: {
        onSubmission: true,
      },
    })
    form.$validate = jest.fn()

    const result = await validateForm.fulfilled(form)

    expect(result).toBe(form)
    expect(form.$validate).toHaveBeenCalled()
  })

  it('should not validate the form before submission if the option set to false', async (): Promise<
    any
  > => {
    const form = createForm({
      validation: {
        onSubmission: false,
      },
    })

    form.$validate = jest.fn()

    const result = await validateForm.fulfilled(form)

    expect(result).toBe(form)
    expect(form.$validate).not.toHaveBeenCalled()
  })

  it('should return rejected promise if there is errors', async (): Promise<
    any
  > => {
    const form = createForm({
      validation: {
        onSubmission: true,
      },
    })
    form.$validate = jest.fn()

    form.$errors.any = jest.fn(() => true)

    expect.assertions(2)

    try {
      await validateForm.fulfilled(form)
    } catch (e) {
      expect(form.$errors.any).toHaveBeenCalled()
      expect(e.message).toBe('Form is invalid.')
    }
  })

  it('should set $submitting to true before the submission', async (): Promise<
    any
  > => {
    const form = createForm()

    const result = await setSubmittingToTrue.fulfilled(form)

    expect(result).toBe(form)
    expect(form.$submitting).toBe(true)
  })
})
