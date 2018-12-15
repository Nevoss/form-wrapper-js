import { Form } from '../../../src/core/Form'

jest.mock('../../../src/core/Errors')
jest.mock('../../../src/core/Validator')
jest.mock('../../../src/core/Touched')

describe('Form.interceptors.ts', () => {
  it('should add new interceptor to the end of the chain when using submissionComplete interceptorManager', async () => {
    let form = new Form({})

    const fulfilledFunc = jest.fn()
    const rejectedFunc = jest.fn()

    form.$interceptors.submissionComplete.use(fulfilledFunc, rejectedFunc)

    let callback = jest.fn(() => Promise.resolve('yay!'))

    await form.submit(callback)

    expect(fulfilledFunc).toHaveBeenCalledTimes(1)
    expect(fulfilledFunc).toHaveBeenLastCalledWith({ response: 'yay!', form })
    expect(fulfilledFunc).toHaveBeenCalledAfter(callback)
    expect(rejectedFunc).toHaveBeenCalledTimes(0)

    fulfilledFunc.mockClear()
    rejectedFunc.mockClear()
    callback.mockClear()

    callback = jest.fn(() => Promise.reject('Oh...'))

    await form.submit(callback)

    expect(rejectedFunc).toHaveBeenCalledTimes(1)
    expect(rejectedFunc).toHaveBeenLastCalledWith({ error: 'Oh...', form })
    expect(rejectedFunc).toHaveBeenCalledAfter(callback)
    expect(fulfilledFunc).toHaveBeenCalledTimes(0)
  })

  it('should add new interceptor to the begging of the chain when using beforeSubmission interceptorManager', async () => {
    let form = new Form({})

    expect.assertions(8)

    const fulfilledFunc = jest.fn(form => form)
    const rejectedFunc = jest.fn(error => Promise.reject(error))

    form.$interceptors.beforeSubmission.use(fulfilledFunc, rejectedFunc)

    let callback = jest.fn(() => Promise.resolve('yay!'))

    await form.submit(callback)

    expect(fulfilledFunc).toHaveBeenCalledTimes(1)
    expect(fulfilledFunc).toHaveBeenLastCalledWith(form)
    expect(fulfilledFunc).toHaveBeenCalledBefore(callback)
    expect(rejectedFunc).toHaveBeenCalledTimes(0)

    fulfilledFunc.mockClear()
    rejectedFunc.mockClear()
    callback.mockClear()

    form.$interceptors.beforeSubmission.use(() => Promise.reject('Error!'))

    try {
      await form.submit(callback)
    } catch (e) {
      expect(rejectedFunc).toHaveBeenCalledTimes(1)
      expect(rejectedFunc).toHaveBeenLastCalledWith('Error!')
      expect(callback).toHaveBeenCalledTimes(0)
      expect(fulfilledFunc).toHaveBeenCalledTimes(0)
    }
  })

  it('should not call the interceptor if the user eject it', async () => {
    let form = new Form({})

    expect.assertions(4)

    const fulfilledFunc = jest.fn()
    const rejectedFunc = jest.fn()

    const interceptorIndex = form.$interceptors.submissionComplete.use(
      fulfilledFunc,
      rejectedFunc
    )
    form.$interceptors.submissionComplete.eject(interceptorIndex)

    await form.submit(() => Promise.resolve())

    expect(fulfilledFunc).toHaveBeenCalledTimes(0)
    expect(rejectedFunc).toHaveBeenCalledTimes(0)

    try {
      await form.submit(() => Promise.reject())
    } catch (e) {
      expect(fulfilledFunc).toHaveBeenCalledTimes(0)
      expect(rejectedFunc).toHaveBeenCalledTimes(0)
    }
  })
})
