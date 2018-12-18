import { Errors } from '../../../src/core/Errors'
import { Validator } from '../../../src/core/Validator'
import { Touched } from '../../../src/core/Touched'
import { Form } from '../../../src/core/Form'
import generateOptions from '../../../src/helpers/generateOptions'
import defaultOptionsSource from '../../../src/default-options'
import { InterceptorManager } from '../../../src/core/InterceptorManager'
import * as utils from '../../../src/utils'

jest.mock('../../../src/core/Errors')
jest.mock('../../../src/core/Validator')
jest.mock('../../../src/core/Touched')

describe('Form.ts', () => {
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
    const rulesArray = [() => true]
    const isDeveloperRulesArray = [() => false]

    let form = new Form({
      first_name: {
        value: 'Nevo',
        label: 'Name',
        rules: rulesArray,
      },
      last_name: 'Golan',
      is_developer: {
        value: false,
        rules: isDeveloperRulesArray,
        extra: {
          options: [1, 0],
        },
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
        options: [1, 0],
      },
    })
    expect(Validator).toHaveBeenCalledWith(
      {
        first_name: rulesArray,
        is_developer: isDeveloperRulesArray,
      },
      defaultOptions.validation
    )
    expect(Errors).toHaveBeenCalled()
    expect(Touched).toHaveBeenCalled()
    expect(form.$interceptors.beforeSubmission).toBeInstanceOf(
      InterceptorManager
    )
    expect(form.$interceptors.submissionComplete).toBeInstanceOf(
      InterceptorManager
    )
  })

  it('should access the form props', () => {
    let form = new Form({
      first_name: 'Nevo',
      last_name: 'Golan',
    }) as Form & FormData

    expect(form.first_name).toBe('Nevo')
    expect(form.last_name).toBe('Golan')
  })

  it('should assign options to the form', () => {
    let form = new Form(data) as Form & FormData

    expect(form.$options).toEqual(defaultOptions)
    expect(form.$options.successfulSubmission.clearErrors).toBe(true)

    const newOptions = { successfulSubmission: { clearErrors: false } }

    form.assignOptions(newOptions)
    expect(form.$options).toEqual(generateOptions(defaultOptions, newOptions))
  })

  it('should returns the values on call', function() {
    let form = new Form(data) as Form & { [key: string]: any }

    form.first_name = 'Nevo'
    form.last_name = 'Golan'

    form.not_real_prop = 'Somthing'

    expect(form.values()).toEqual({
      ...data,
      first_name: 'Nevo',
      last_name: 'Golan',
    })
  })

  it('should resetValues the values of the form', () => {
    let form = new Form(data) as Form & FormData

    form.first_name = 'Nevo'
    form.last_name = 'Golan'

    form.resetValues()

    expect(form.values()).toEqual(data)
  })

  it('should fill the form with new values', () => {
    let form = new Form(data) as Form & FormData

    let newData = {
      first_name: 'Nevo',
      last_name: 'Golan',
      not_real_prop: 'Somthing',
    }

    form.fill(newData)

    expect(form.values()).toEqual(
      Object.assign({}, data, {
        first_name: 'Nevo',
        last_name: 'Golan',
      })
    )
  })

  it('should change the defaultOptions options of the Form', () => {
    Form.defaults.options.validation.defaultMessage = ({ label, value }) =>
      `${label}: ${value}`
    Form.defaults.options.successfulSubmission.clearErrors = false
    Form.defaults.options.successfulSubmission.resetValues = false

    let form = new Form(data)

    expect(
      form.$options.validation.defaultMessage(
        { label: 'a', value: 'b', key: 'c' },
        form
      )
    ).toEqual('a: b')
    expect(form.$options.successfulSubmission.clearErrors).toBe(false)
    expect(form.$options.successfulSubmission.resetValues).toBe(false)
  })

  it('should assign defaultOptions to the form', () => {
    Form.assignDefaultOptions({
      validation: {
        defaultMessage: ({ label, value }) => `${label}: ${value}`,
      },
      successfulSubmission: {
        clearErrors: false,
        resetValues: false,
      },
    })

    let form = new Form(data)

    expect(
      form.$options.validation.defaultMessage(
        { label: 'a', value: 'b', key: 'c' },
        form
      )
    ).toEqual('a: b')
    expect(form.$options.successfulSubmission.clearErrors).toBe(false)
    expect(form.$options.successfulSubmission.resetValues).toBe(false)
  })

  it('should determine if field is dirty', () => {
    let form = new Form(data) as Form & FormData

    form.first_name = 'something else'

    expect(form.isFieldDirty('first_name')).toBe(true)
    expect(form.isFieldDirty('last_name')).toBe(false)
  })

  it('should warn if field key that passed to isDirtyField is not exists', () => {
    let warnMock = jest.spyOn(utils, 'warn')

    let form = new Form({ name: null })

    form.isFieldDirty('some_key')

    expect(warnMock).toHaveBeenCalledTimes(1)
  })

  it('should run isFieldDirty (argument passes to "isDirty")', () => {
    let form = new Form(data) as Form & FormData

    form.isFieldDirty = jest.fn(() => false)

    let res = form.isDirty('first_name')
    expect(form.isFieldDirty).toHaveBeenCalledWith('first_name')
    expect(res).toBe(false)
  })

  it('should determine if the whole form is dirty or not', () => {
    let form = new Form(data) as Form & FormData

    expect(form.isDirty()).toBe(false)

    form.last_name = 'somthing else'

    expect(form.isDirty()).toBe(true)
  })

  it('should reset all the form state', () => {
    let form = new Form(data)

    form.resetValues = jest.fn()

    form.reset()

    expect(form.resetValues).toHaveBeenCalledTimes(1)
    expect(form.$errors.clear).toHaveBeenCalledTimes(1)
    expect(form.$touched.clear).toHaveBeenCalledTimes(1)
  })
})
