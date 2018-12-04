import {Errors} from "../../src/core/Errors"
import {Validator} from "../../src/core/Validator"
import {Touched} from "../../src/core/Touched"
import {Form} from "../../src"
import generateOptions from '../../src/helpers/generateOptions'
import defaultOptionsSource from '../../src/defaults'

jest.mock('../../src/core/Errors')
jest.mock('../../src/core/Validator')
jest.mock('../../src/core/Touched')

describe('Form.js', () => {

  interface FormData {
    first_name: string | null
    last_name: string | null
    is_developer: boolean
  }

  let data: FormData = {
    first_name: null,
    last_name: null,
    is_developer: false,
  }

  let defaultOptions = Object.assign({}, defaultOptionsSource)


  beforeEach(() => {
    Validator.prototype.validateField = jest.fn(() => [])
  })


  it('should init correctly', () => {
    const rulesArray = [
      () => true,
    ]

    let form = new Form({
      first_name: {
        value: 'Nevo',
        label: 'Name',
        rules: rulesArray,
      },
      last_name: 'Golan',
      is_developer: {
        value: false,
        extra: {
          options: [1, 0]
        }
      },
    }) as Form & FormData

    expect(form.first_name).toBe('Nevo')
    expect(form.last_name).toBe('Golan')
    expect(form.is_developer).toBe(false)
    expect(form.$labels).toEqual({
      first_name: 'Name',
      last_name: 'Last name',
      is_developer: 'Is developer',
    })
    expect(form.$extra).toEqual({
      first_name: {},
      last_name: {},
      is_developer: {
        options: [1, 0]
      }
    })
    expect(Validator).toHaveBeenCalledWith({first_name: rulesArray}, defaultOptions.validation)
    expect(Errors).toHaveBeenCalled()
    expect(Touched).toHaveBeenCalled()
  });


  it('should access the form props', () => {
    let form = new Form({
      first_name: 'Nevo',
      last_name: 'Golan',
    }) as Form & FormData

    expect(form.first_name).toBe('Nevo')
    expect(form.last_name).toBe('Golan')
  });


  it('should assign options to the form', () => {
    let form = new Form(data) as Form & FormData

    expect(form.$options).toEqual(defaultOptions)
    expect(form.$options.successfulSubmission.clearErrors).toBe(true)

    const newOptions = { successfulSubmission: { clearErrors: false } }

    form.assignOptions(newOptions)
    expect(form.$options).toEqual(generateOptions(defaultOptions, newOptions))
  });


  it('should returns the data on call', function () {
    let form = new Form(data) as Form & { [key: string]: any }

    form.first_name = 'Nevo'
    form.last_name = 'Golan'

    form.not_real_prop = 'Somthing'

    expect(form.data()).toEqual({
      ...data,
      first_name: 'Nevo',
      last_name: 'Golan',
    })
  })


  it('should reset the data of the form', () => {
    let form = new Form(data) as Form & FormData

    form.first_name = 'Nevo'
    form.last_name = 'Golan'

    form.reset()

    expect(form.data()).toEqual(data)
  })


  it('should fill the form with new data', () => {
    let form = new Form(data) as Form & FormData

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
    let form = new Form(data) as Form & FormData

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
    expect(form.$errors.clear).toHaveBeenCalledTimes(1)
    expect(form.$touched.clear).toHaveBeenCalledTimes(1)
    expect(form.reset).toHaveBeenCalledTimes(1);
    expect(Form.successfulSubmissionHook).toBeCalledWith(responseParam, form)
    expect(Form.unSuccessfulSubmissionHook).not.toHaveBeenCalledTimes(1)
    expect(response).toBe(responseParam);
  })


  it('should send reject promise if the callback was return reject promise', async () => {
    let form = new Form(data) as Form & FormData

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
      expect(Form.successfulSubmissionHook).not.toHaveBeenCalled()
      expect(e).toBe(responseParam)

    }
  })


  it('should set $submitting as true if submit method is called and false if validation failed and callback method not called', async () => {
    let form = new Form(data) as Form & FormData

    let mockCallable = jest.fn(() => Promise.resolve())
    form.validate = jest.fn(() => false)
    form.submit(mockCallable).catch(() => {})

    expect(form.$submitting).toBe(false)

    form.validate = jest.fn(() => true)
    form.submit(mockCallable)

    expect(form.$submitting).toBe(true)
    expect(mockCallable.mock.calls.length).toBe(1)
  });


  it('should not reset after success submission if resetDataAfterSuccessfulSubmission option is false', async () => {
    let form = new Form(data, {
      successfulSubmission: {
        resetData: false
      },
    }) as Form & FormData

    form.reset = jest.fn()

    await form.submit(() => Promise.resolve())

    expect(form.$errors.clear).toHaveBeenCalledTimes(1)
    expect(form.$touched.clear).toHaveBeenCalledTimes(1)
    expect(form.reset).not.toHaveBeenCalled()
  });


  it('should not clear errors after success submission if clearErrorsAfterSuccessfulSubmission option is false', async () => {
    let form = new Form(data, {
      successfulSubmission: {
        clearErrors: false
      },
    }) as Form & FormData

    form.reset = jest.fn()

    await form.submit(() => Promise.resolve())

    expect(form.$errors.clear).not.toHaveBeenCalled()
    expect(form.$touched.clear).toHaveBeenCalledTimes(1)
    expect(form.reset).toHaveBeenCalledTimes(1)
  });


  it('should not clear touched after success submission if successfulSubmission.clearTouched set to false', async () => {
    let form = new Form(data, {
      successfulSubmission: {
        clearTouched: false
      },
    }) as Form & FormData

    form.reset = jest.fn()

    await form.submit(() => Promise.resolve())

    expect(form.$errors.clear).toHaveBeenCalledTimes(1)
    expect(form.$touched.clear).not.toHaveBeenCalled()
    expect(form.reset).toHaveBeenCalledTimes(1)
  });


  it('should call to validate specific field or all the fields', () => {
    let form = new Form(data) as Form & FormData

    form.validateAll = jest.fn()
    form.validateField = jest.fn()

    form.validate()

    expect(form.validateAll).toHaveBeenCalledTimes(1)
    expect(form.validateField).not.toHaveBeenCalled()

    form.validate('first_name')

    expect(form.validateAll).toHaveBeenCalledTimes(1)
    expect(form.validateField).toHaveBeenCalledTimes(1)
  });


  it('should validate specific field', () => {
    let form = new Form({
      name: {
        value: 'a',
        label: 'The Name',
        rules: [ () => true ]
      }
    }) as Form & { name: string }

    form.$validator.validateField = jest.fn(() => [ 'error' ])

    let isValid = form.validateField('name')

    expect(isValid).toBe(false)
    expect(form.$errors.clearField).toHaveBeenCalledTimes(1)
    expect(form.$errors.clearField).toBeCalledWith('name')
    expect(form.$errors.append).toHaveBeenCalledTimes(1)
    expect(form.$errors.append).toBeCalledWith({
      name: [ 'error' ]
    })
    expect(form.$validator.validateField).toBeCalledWith({ label: 'The Name', value: 'a', key: 'name' }, form)


    form.$validator.validateField = jest.fn(() => [])

    isValid = form.validateField('name')
    expect(isValid).toBe(true)
    expect(form.$errors.append).toHaveBeenCalledTimes(1)
    expect(form.$errors.clearField).toHaveBeenCalledTimes(2)
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
    expect(form.validateField).toHaveBeenNthCalledWith(1, 'name')
    expect(form.validateField).toHaveBeenNthCalledWith(2, 'last_name')


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


  it('should change the defaults options of the Form', () => {
    Form.defaults.validation.defaultMessage = ({label, value}) => `${label}: ${value}`
    Form.defaults.successfulSubmission.clearErrors = false
    Form.defaults.successfulSubmission.resetData = false

    let form = new Form(data)

    expect(form.$options.validation.defaultMessage({ label: 'a', value: 'b', key: 'c' }, form)).toEqual('a: b')
    expect(form.$options.successfulSubmission.clearErrors).toBe(false)
    expect(form.$options.successfulSubmission.resetData).toBe(false)
  });


  it('should determine if field is dirty', () => {
    let form = new Form(data) as Form & FormData

    form.first_name = 'something else';

    expect(form.isFieldDirty('first_name')).toBe(true)
    expect(form.isFieldDirty('last_name')).toBe(false)
  });


  it('should run isFieldDirty (argument passes to "isDirty")', () => {
    let form = new Form(data) as Form & FormData

    form.isFieldDirty = jest.fn(() => false)

    let res = form.isDirty('first_name')
    expect(form.isFieldDirty).toHaveBeenCalledWith('first_name')
    expect(res).toBe(false)
  });


  it('should determine if the whold form is dirty or not', () => {
    let form = new Form(data) as Form & FormData

    expect(form.isDirty()).toBe(false)

    form.last_name = 'somthing else'

    expect(form.isDirty()).toBe(true)
  });

})
