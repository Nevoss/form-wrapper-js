import { Form } from '../../../src/core/Form'

jest.mock('../../../src/core/Errors')
jest.mock('../../../src/core/Validator')
jest.mock('../../../src/core/Touched')

describe('Form.submit.ts', () => {
  it('should successfully submitted if the callback returns Promise.resolve', async () => {
    let form = new Form({}) as Form

    let responseParam = {
      status: 200,
      data: {},
    }

    form.resetValues = jest.fn()

    expect.assertions(6)

    let mockCallable = jest.fn(formParam => {
      expect(formParam).toBe(form)

      return Promise.resolve(responseParam)
    })

    let response = await form.submit(mockCallable)

    expect(mockCallable.mock.calls.length).toBe(1)
    expect(form.$errors.clear).toHaveBeenCalledTimes(1)
    expect(form.$touched.clear).toHaveBeenCalledTimes(1)
    expect(form.resetValues).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ form, response: responseParam })
  })

  it('should send reject promise if the callback was return reject promise', async () => {
    let form = new Form({}) as Form

    let responseParam = {
      status: 404,
    }

    let mockCallable = jest.fn(() => Promise.reject(responseParam))

    expect.assertions(2)

    try {
      await form.submit(mockCallable)
    } catch (e) {
      expect(mockCallable.mock.calls.length).toBe(1)
      expect(e).toEqual({ error: responseParam, form })
    }
  })

  it('should validate the form on submission if the option is set to validate the form', async () => {
    let form = new Form(
      {
        name: 'Nevo',
        rules: [() => true],
      },
      {
        validation: {
          onSubmission: true,
        },
      }
    )

    // mock the validate method to return FALSE
    form.validate = jest.fn(() => false)

    expect.assertions(4)

    try {
      await form.submit(() => Promise.resolve())
    } catch (e) {
      expect(form.validate).toBeCalled()
      expect(e.hasOwnProperty('error')).toBe(true)
      expect(e.error.hasOwnProperty('message')).toBe(true)
      expect(e.form).toBe(form)
    }
  })

  it('should set $submitting as true if submit method is called', () => {
    let form = new Form({}) as Form

    form.validate = jest.fn(() => true)

    expect.assertions(2)

    return form
      .submit(formParam => {
        expect(formParam.$submitting).toBe(true)

        return new Promise(resolve => resolve('Yay!'))
      })
      .then(() => {
        expect(form.$submitting).toBe(false)
      })
  })

  it('should set $submitting false if validation failed and callback method not called', () => {
    let form = new Form({}) as Form

    let mockCallable = jest.fn(() => Promise.resolve())
    form.validate = jest.fn(() => false)
    form.submit(mockCallable).catch(() => false)

    expect(form.$submitting).toBe(false)
    expect(mockCallable).toHaveBeenCalledTimes(0)
  })

  it('should not resetValues after success submission if resetValues option is false', async () => {
    let form = new Form(
      {},
      {
        successfulSubmission: {
          resetValues: false,
        },
      }
    ) as Form

    form.resetValues = jest.fn()

    await form.submit(() => Promise.resolve())

    expect(form.$errors.clear).toHaveBeenCalledTimes(1)
    expect(form.$touched.clear).toHaveBeenCalledTimes(1)
    expect(form.resetValues).not.toHaveBeenCalled()
  })

  it('should not clear errors after success submission if clearErrorsAfterSuccessfulSubmission option is false', async () => {
    let form = new Form(
      {},
      {
        successfulSubmission: {
          clearErrors: false,
        },
      }
    ) as Form

    form.resetValues = jest.fn()

    await form.submit(() => Promise.resolve())

    expect(form.$errors.clear).not.toHaveBeenCalled()
    expect(form.$touched.clear).toHaveBeenCalledTimes(1)
    expect(form.resetValues).toHaveBeenCalledTimes(1)
  })

  it('should not clear touched after success submission if successfulSubmission.clearTouched set to false', async () => {
    let form = new Form(
      {},
      {
        successfulSubmission: {
          clearTouched: false,
        },
      }
    ) as Form & FormData

    form.resetValues = jest.fn()

    await form.submit(() => Promise.resolve())

    expect(form.$errors.clear).toHaveBeenCalledTimes(1)
    expect(form.$touched.clear).not.toHaveBeenCalled()
    expect(form.resetValues).toHaveBeenCalledTimes(1)
  })
})
