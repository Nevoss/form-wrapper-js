describe('core/Form.ts - Submission', (): void => {
  it('should call all the interceptors and submit the form', async (): Promise<
    any
  > => {
    const mockResponse = {
      status: 200,
      data: {
        status: 'Good!',
      },
    }

    const callback = jest.fn(() => Promise.resolve(mockResponse))
  })
})
