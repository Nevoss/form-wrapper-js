import { Errors } from "../../src/core/Errors"
import { Form } from "../../src/core/Form"
import defaultOptionsSource from '../../src/defaults'

jest.mock('../../src/core/Errors')

describe('Form.js', () => {

  let data = {
    first_name: null,
    last_name: null,
    is_developer: false,
  }
  
  let defaultOptions = Object.assign({}, defaultOptionsSource)


  beforeEach(() => {
    Errors.mockClear()
  })

  
  it('should assign options to the form', () => {
    let form = new Form(data)

    expect(form.$options).toEqual(defaultOptions)
    expect(form.$options.clearErrorsAfterSuccessfulSubmission).toBeTruthy()

    const newOptions = { clearErrorsAfterSuccessfulSubmission: false }

    form.assignOptions(newOptions)
    expect(form.$options).toEqual(Object.assign({}, defaultOptions, newOptions))
  });


  it('should returns the data on call', function () {
    let form = new Form(data)

    form.first_name = 'Nevo'
    form.last_name = 'Golan'

    form.not_real_prop = 'Somthing'

    expect(form.data()).toEqual(Object.assign({}, data, {
      first_name: 'Nevo',
      last_name: 'Golan',
    }))
  })


  it('should reset the data of the form', () => {
    let form = new Form(data)

    form.first_name = 'Nevo'
    form.last_name = 'Golan'

    form.reset()

    expect(form.data()).toEqual(data)
  })


  it('should fill the form with new data', () => {
    let form = new Form(data)

    let newData = {
      first_name: 'Nevo',
      last_name: 'Golan',
      not_real_prop: 'Somthing'
    }

    form.fill(newData)

    expect(form.data()).toEqual(Object.assign({}, data, {
      first_name: 'Nevo',
      last_name: 'Golan',
    }))
  })


  it('should successfully submitted if the callback returns Promise.resolve', async () => {
    let form = new Form(data)

    let responseParam = {
      status: 200,
      data: {}
    }

    Form.successfulSubmissionHook = jest.fn(() => Promise.resolve(responseParam));
    Form.unSuccessfulSubmissionHook = jest.fn();
    form.reset = jest.fn()

    let mockCallable = jest.fn(() => Promise.resolve(responseParam))

    let response = await form.submit(mockCallable)

    expect(mockCallable.mock.calls.length).toBe(1)
    expect(form.$errors.clear.mock.calls.length).toBe(2);
    expect(form.reset.mock.calls.length).toBe(1);
    expect(Form.successfulSubmissionHook).toBeCalledWith(responseParam, form)
    expect(Form.unSuccessfulSubmissionHook.mock.calls.length).toBe(0)
    expect(response).toBe(responseParam);
  })


  it('should send reject promise if the callback was send reject promise', async () => {
    let form = new Form(data)

    let responseParam = {
      status: 404,
    }

    Form.successfulSubmissionHook = jest.fn();
    Form.unSuccessfulSubmissionHook = jest.fn(() => Promise.reject(responseParam));

    let mockCallable = jest.fn(() => Promise.reject(responseParam))

    expect.assertions(4)

    try {
      await form.submit(mockCallable)

    } catch (e) {
      expect(mockCallable.mock.calls.length).toBe(1)
      expect(Form.unSuccessfulSubmissionHook).toBeCalledWith(responseParam, form)
      expect(Form.successfulSubmissionHook.mock.calls.length).toBe(0)
      expect(e).toBe(responseParam)

    }
  })
  

  it('should not double submit the form until the promise is resolve or reject', async () => {
    let form = new Form(data)

    let mockCallable = jest.fn(() => Promise.resolve())

    expect.assertions(3)

    form.submit(mockCallable)

    expect(form.$submitting).toBeTruthy()

    try {
      await form.submit(mockCallable)
    } catch (e) {
      expect(e).not.toBeUndefined()
    }

    expect(mockCallable.mock.calls.length).toBe(1)

  });


  it('should not reset after success submission if resetDataAfterSuccessfulSubmission option is false', async () => {
    let form = new Form(data, {
      resetDataAfterSuccessfulSubmission: false
    })

    form.reset = jest.fn()

    await form.submit(() => Promise.resolve())

    expect(form.reset.mock.calls.length).toBe(0)
  });


  it('should not clear errors after success submission if clearErrorsAfterSuccessfulSubmission option is false', async () => {
    let form = new Form(data, {
      clearErrorsAfterSuccessfulSubmission: false
    })

    await form.submit(() => Promise.resolve())

    expect(form.$errors.clear.mock.calls.length).toBe(1)
  });

})
