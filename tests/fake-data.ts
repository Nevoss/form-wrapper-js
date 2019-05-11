import faker from 'faker'
import defaultOptions from '../src/default-options'
import { Field, FieldDeclaration } from '../src/types/fields'
import { Options } from '../src/types/options'
import { FormCollection } from '../src/core/FormCollection'

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
