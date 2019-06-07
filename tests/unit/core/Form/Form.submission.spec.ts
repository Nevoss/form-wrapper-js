import { Form } from '../../../../src/core/Form'
import createInterceptors from '../../../../src/factories/InterceptorsFactory'
import { mocked } from 'ts-jest/utils'
import { Interceptors } from '../../../../src/core/Interceptors'
import {
  createFakeFulfilledInterceptor,
  createFakeRejectedInterceptor,
} from '../../../fake-data'

jest.mock('../../../../src/factories/InterceptorsFactory')

describe('core/Form.ts - Submission', (): void => {
  let beforeSubmission: any[] = []
  let afterSubmission: any[] = []

  beforeEach(() => {
    for (let i = 0; i <= 1; i++) {
      beforeSubmission.push({
        fulfilled: createFakeFulfilledInterceptor(),
        rejected: createFakeRejectedInterceptor(),
      })
    }

    for (let i = 0; i <= 1; i++) {
      afterSubmission.push({
        fulfilled: createFakeFulfilledInterceptor(),
        rejected: createFakeRejectedInterceptor(),
      })
    }

    mocked(createInterceptors).mockImplementation(() => ({
      beforeSubmission: new Interceptors(beforeSubmission),
      submissionComplete: new Interceptors(afterSubmission),
    }))
  })

  it('should call all the interceptors and submit the form', async (): Promise<
    any
  > => {
    const mockResponse = {
      status: 200,
      data: {
        status: 'Good!',
      },
    }

    const callback = jest.fn(() => {
      return Promise.resolve(mockResponse)
    })

    const form = Form.create()

    await form.$submit(callback)

    expect(callback).toHaveBeenCalledWith(form)
    expect(beforeSubmission[0].fulfilled).toHaveBeenCalledWith(form)
    expect(beforeSubmission[1].fulfilled).toHaveBeenCalledWith(form)
    expect(afterSubmission[0].fulfilled).toHaveBeenCalledWith(
      expect.objectContaining({
        form,
        response: mockResponse,
      })
    )
    expect(afterSubmission[1].fulfilled).toHaveBeenCalledWith(
      expect.objectContaining({
        form,
        response: mockResponse,
      })
    )
  })

  it('should call the rejected chain in the interceptors', async (): Promise<
    any
  > => {
    const mockResponse = {
      status: 400,
      data: {
        status: 'Bad!',
      },
    }

    expect.assertions(6)

    const callback = jest.fn(() => {
      return Promise.reject(mockResponse)
    })

    const form = Form.create()

    try {
      await form.$submit(callback)
    } catch (e) {
      expect(callback).toHaveBeenCalledWith(form)

      expect(beforeSubmission[0].fulfilled).toHaveBeenCalledWith(form)
      expect(beforeSubmission[1].fulfilled).toHaveBeenCalledWith(form)
      expect(afterSubmission[0].rejected).toHaveBeenCalledWith(
        expect.objectContaining({
          form,
          error: mockResponse,
        })
      )
      expect(afterSubmission[1].rejected).toHaveBeenCalledWith(
        expect.objectContaining({
          form,
          error: mockResponse,
        })
      )

      expect(e).toEqual({
        form,
        error: mockResponse,
      })
    }
  })
})
