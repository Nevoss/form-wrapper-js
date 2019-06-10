import { Interceptors } from '../../../src/core/Interceptors'
import { Interceptor } from '../../../src/types/interceptors'

describe('core/Interceptors.ts', (): void => {
  it('should add new Interceptor to the chain', (): void => {
    const interceptors = new Interceptors()

    const fulfilled = jest.fn()
    const rejected = jest.fn()

    interceptors.use(fulfilled, rejected)

    const chain = interceptors.all()

    expect(chain).toHaveLength(1)
    expect(chain[0].fulfilled).toBe(fulfilled)
    expect(chain[0].rejected).toBe(rejected)
  })

  it('should remove the Interceptor from the chain', (): void => {
    const interceptors = new Interceptors()

    const index = interceptors.use(jest.fn())

    interceptors.eject(index)

    expect(interceptors.all()[0].fulfilled).toBe(null)
    expect(interceptors.all()[0].rejected).toBe(null)
  })

  it('should merge interceptors into the chain', (): void => {
    const interceptors = new Interceptors()

    interceptors.use(jest.fn(), jest.fn())

    const interceptor = {
      fulfilled: jest.fn(),
      rejected: null,
    }

    interceptors.merge([interceptor])

    expect(interceptors.all()).toHaveLength(2)
    expect(interceptors.all()[0]).toEqual(interceptor)
  })

  it('should merge interceptors on constructor', (): void => {
    const chain = [
      {
        fulfilled: jest.fn(),
        rejected: null,
      },
    ]

    jest.spyOn(Interceptors.prototype, 'merge')

    const interceptors = new Interceptors(chain)

    expect(interceptors.merge).toHaveBeenCalledWith(chain)
  })

  it('should run function for each of the interceptors', (): void => {
    const interceptor1 = {
      fulfilled: jest.fn(),
      rejected: null,
    }

    const interceptor2 = {
      fulfilled: null,
      rejected: jest.fn(),
    }

    const callbackMock = jest.fn((item: Interceptor) => item)

    const interceptors = new Interceptors([interceptor1, interceptor2])

    interceptors.forEach(callbackMock)

    expect(callbackMock).toHaveBeenNthCalledWith(1, interceptor1)
    expect(callbackMock).toHaveBeenNthCalledWith(2, interceptor2)
  })
})
