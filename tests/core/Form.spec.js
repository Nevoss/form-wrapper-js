import { Errors } from "../../src/core/Errors"
import { Validator } from "../../src/core/Validator"
import { Form } from "../../src/core/Form"
import generateDefaultLabel from '../../src/helpers/generateDefaultLabel'
import defaultOptionsSource from '../../src/defaults'
import { mergeDeep } from "../../src/utils";

jest.mock('../../src/core/Errors')
jest.mock('../../src/core/Validator')
jest.mock('../../src/helpers/generateDefaultLabel', () => jest.fn().mockImplementation(() => 'a'))

describe('Form.js', () => {

  let data = {
    first_name: null,
    last_name: null,
    is_developer: false,
  }

  let defaultOptions = Object.assign({}, defaultOptionsSource)


  beforeEach(() => {
    Errors.mockClear()
    Validator.mockClear()

    Validator.prototype.validateField = jest.fn(() => [])
  })


  it('should init correctly', () => {
    const rulesArray = [
      () => true,
    ]

    let form = new Form({
      name: {
        value: 'Nevo',
        label: 'Name',
        rules: rulesArray,
      },
      last_name: 'Golan'
    })

    expect(form.name).toBe('Nevo')
    expect(form.last_name).toBe('Golan')
    expect(generateDefaultLabel.mock.calls).toHaveLength(1)
    expect(generateDefaultLabel).toBeCalledWith('last_name')
    expect(form.$labels).toEqual({
      name: 'Name',
      last_name: 'a'
    })
    expect(Validator).toHaveBeenCalledWith({name: rulesArray}, defaultOptions.validation)
    expect(Errors).toHaveBeenCalled()
  });


  it('should access the form props', () => {
    let form = new Form({
      first_name: 'Nevo',
      last_name: 'Golan',
    })

    expect(form.first_name).toBe('Nevo')
    expect(form.last_name).toBe('Golan')
  });


  it('should assign options to the form', () => {
    let form = new Form(data)

    expect(form.$options).toEqual(defaultOptions)
    expect(form.$options.successfulSubmission.clearErrors).toBe(true)

    const newOptions = { successfulSubmission: { clearErrors: false } }

    form.assignOptions(newOptions)
    expect(form.$options).toEqual(mergeDeep(defaultOptions, newOptions))
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
    expect(form.$errors.clear.mock.calls.length).toBe(1);
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


  it('should set $submitting as true if submit method is called', async () => {
    let form = new Form(data)

    let mockCallable = jest.fn(() => Promise.resolve())

    form.submit(mockCallable)

    expect(form.$submitting).toBeTruthy()

    expect(mockCallable.mock.calls.length).toBe(1)
  });


  it('should not reset after success submission if resetDataAfterSuccessfulSubmission option is false', async () => {
    let form = new Form(data, {
      successfulSubmission: {
        resetData: false
      },
    })

    form.reset = jest.fn()

    await form.submit(() => Promise.resolve())

    expect(form.$errors.clear.mock.calls.length).toBe(1)
    expect(form.reset.mock.calls.length).toBe(0)
  });


  it('should not clear errors after success submission if clearErrorsAfterSuccessfulSubmission option is false', async () => {
    let form = new Form(data, {
      successfulSubmission: {
        clearErrors: false
      },
    })

    form.reset = jest.fn()

    await form.submit(() => Promise.resolve())

    expect(form.$errors.clear.mock.calls.length).toBe(0)
    expect(form.reset.mock.calls.length).toBe(1)
  });


  it('should call to validate specific field or all the fields', () => {
    let form = new Form(data)

    form.validateAll = jest.fn()
    form.validateField = jest.fn()

    form.validate()

    expect(form.validateAll.mock.calls).toHaveLength(1)
    expect(form.validateField.mock.calls).toHaveLength(0)

    form.validate('first_name')

    expect(form.validateAll.mock.calls).toHaveLength(1)
    expect(form.validateField.mock.calls).toHaveLength(1)
  });


  it('should validate specific field', () => {
    let form = new Form({
      name: {
        value: 'a',
        label: 'The Name',
        rules: [ () => true ]
      }
    })

    let callbackFunction = jest.fn(() => 'error')
    form.$validator.validateField = jest.fn(() => [ callbackFunction ])

    let isValid = form.validateField('name')

    expect(isValid).toBe(false)
    expect(form.$errors.record.mock.calls).toHaveLength(1)
    expect(callbackFunction).toBeCalledWith({ label: 'The Name', value: 'a' }, form)
    expect(form.$errors.record).toBeCalledWith({
      name: [ 'error' ]
    })

    form.$validator.validateField = jest.fn(() => [])

    isValid = form.validateField('name')
    expect(isValid).toBe(true)
    expect(form.$errors.record.mock.calls).toHaveLength(1)
  });


  it('should validate all the fields of the form', () => {
    let form = new Form({
      name: {
        value: null,
        rules: [ () => true ]
      },
      last_name: {
        value: null,
        rules: [ () => false ]
      }
    })

    form.validateField = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true)

    expect(form.validateAll()).toBe(true)
    expect(form.validateField.mock.calls[0][0]).toEqual('name')
    expect(form.validateField.mock.calls[1][0]).toEqual('last_name')


    form.validateField = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false)
    expect(form.validateAll()).toBe(false)

  });


  it('should validate the form on submission if the option is set to validate the form', async () => {
    let form =  new Form({
      name: 'Nevo',
      rules: [ () => true ]
    }, {
      validation: {
        onSubmission: true
      }
    })

    form.validate = jest.fn(() => false)

    expect.assertions(2)

    try {
      await form.submit(() => Promise.resolve())

    } catch (e) {
      expect(form.validate).toBeCalled()
      expect(e.hasOwnProperty('message')).toBe(true)
    }
  });

})
