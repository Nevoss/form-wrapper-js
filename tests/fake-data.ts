import faker from 'faker'
import defaultOptions from '../src/default-options'
import { Field, FieldDeclaration } from '../src/types/fields'
import { Options } from '../src/types/options'
import { FormCollection } from '../src/core/FormCollection'
import { RuleMessageFunction } from '../src/types/validation'
import { FormWithFields } from '../src/types/form'
import { Rule } from '../src/core/Rule'
import { ConditionalRules } from '../src/core/ConditionalRules'
import { Rules } from '../src/core/Rules'

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
export const createFakeField = (value?: any): Field => {
  return {
    label: faker.lorem.words(),
    value: value ? value : faker.lorem.words(),
    key: faker.lorem.word(),
    extra: {},
  }
}

/**
 * creates a fake rule
 */
export const createFakeRule = (): Rule => {
  return new Rule(jest.fn())
}

/**
 * creates fake conditional rules object
 */
export const createFakeConditionalRules = (
  rules: Rule[] = []
): ConditionalRules => {
  return new ConditionalRules(jest.fn(), rules)
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
