import createInterceptors from '../../../src/factories/InterceptorsFactory'
import { Interceptors } from '../../../src/core/Interceptors'
import { Form } from '../../../src/core/Form'
import {
  setSubmittingToTrue,
  validateForm,
} from '../../../src/interceptors/beforeSubmission'
import {
  clearForm,
  setSubmittingToFalse,
} from '../../../src/interceptors/submissionComplete'

describe('factories/InterceptorsFactory.ts', (): void => {
  it('should create an Interceptors object', (): void => {
    const interceptors = createInterceptors()

    expect(interceptors.beforeSubmission).toBeInstanceOf(Interceptors)
    expect(interceptors.submissionComplete).toBeInstanceOf(Interceptors)
  })

  it('should set before submission interceptors in the right order', (): void => {
    const firstInterceptor = jest.fn()
    const secondInterceptor = jest.fn()

    Form.defaults.interceptors.beforeSubmission.use(firstInterceptor)
    Form.defaults.interceptors.beforeSubmission.use(secondInterceptor)

    const interceptors = createInterceptors()

    const chain = interceptors.beforeSubmission.all()

    expect(chain[0]).toBe(validateForm)
    expect(chain[1]).toBe(setSubmittingToTrue)
    expect(chain[2].fulfilled).toBe(firstInterceptor)
    expect(chain[3].fulfilled).toBe(secondInterceptor)
  })

  it('should set submission complete interceptors in the right order', (): void => {
    const firstInterceptor = jest.fn()
    const secondInterceptor = jest.fn()

    Form.defaults.interceptors.submissionComplete.use(firstInterceptor)
    Form.defaults.interceptors.submissionComplete.use(secondInterceptor)

    const interceptors = createInterceptors()

    const chain = interceptors.submissionComplete.all()

    expect(chain[0]).toBe(setSubmittingToFalse)
    expect(chain[1]).toBe(clearForm)
    expect(chain[2].fulfilled).toBe(firstInterceptor)
    expect(chain[3].fulfilled).toBe(secondInterceptor)
  })
})
