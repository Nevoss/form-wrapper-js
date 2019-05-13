import faker from 'faker'
import defaultOptions from '../src/default-options'
import { Field, FieldDeclaration } from '../src/types/fields'
import { Options } from '../src/types/options'
import { FormCollection } from '../src/core/FormCollection'
import { RuleMessageFunction } from '../src/types/validation'
import { FormWithFields } from '../src/types/form'

/**
 * creates a fake Field declaration
 */
export const createFakeFieldDeclaration = (
  formCollectionAsValue = false
): FieldDeclaration => {
  return {
    label: faker.lorem.words(),
    value: formCollectionAsValue
      ? FormCollection.create()
      : faker.lorem.words(),
    rules: [],
    extra: {},
  }
}

/**
 * creates a fake Field
 */
export const createFakeField = (): Field => {
  return {
    label: faker.lorem.words(),
    value: faker.lorem.words(),
    key: faker.lorem.word(),
    extras: {},
  }
}

/**
 * Creates a fake rule message function
 */
export const createFakeRuleMessageFunction = (): RuleMessageFunction => {
  return jest.fn(
    (field: Field, form: FormWithFields): string => faker.lorem.words()
  )
}

/**
 * Create fake options
 */
export const createFakeOptions = (): Options => {
  return {
    successfulSubmission: {
      ...defaultOptions.successfulSubmission,
    },
    validation: {
      ...defaultOptions.validation,
    },
  }
}
