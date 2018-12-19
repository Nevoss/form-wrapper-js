import generateOptions from '../../src/helpers/generateOptions'
import defaultOptions from '../../src/default-options'

describe('generateOptions.ts', () => {
  it('should generate new options object from default options and new options Object', () => {
    expect(defaultOptions.successfulSubmission.resetValues).toBe(true)
    expect(defaultOptions.successfulSubmission.clearErrors).toBe(true)
    expect(defaultOptions.validation.onSubmission).toBe(true)
    expect(defaultOptions.validation.stopAfterFirstRuleFailed).toBe(true)

    const newOptions = generateOptions(defaultOptions, {
      successfulSubmission: {
        resetValues: false,
      },
      validation: {
        onSubmission: false,
      },
    })

    expect(newOptions.successfulSubmission.resetValues).toBe(false)
    expect(newOptions.successfulSubmission.clearErrors).toBe(true)
    expect(newOptions.validation.onSubmission).toBe(false)
    expect(newOptions.validation.stopAfterFirstRuleFailed).toBe(true)
  })
})
