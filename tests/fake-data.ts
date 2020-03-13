import faker from 'faker'
import defaultOptions from '../src/default-options'
import { Field, FieldDeclaration } from '../src/types/fields'
import { Options } from '../src/types/options'
import { RuleMessageFunction } from '../src/types/validation'
import { Rule } from '../src/core/Rule'
import { ConditionalRules } from '../src/core/ConditionalRules'

/**
 * creates a fake Field declaration
 */
export const createFakeFieldDeclaration = (): FieldDeclaration => {
  return {
    label: faker.lorem.words(),
    value: faker.lorem.words(),
    rules: [],
    extra: {},
    transformer: {
      transformIn: jest.fn((value): any => value),
      transformOut: jest.fn((value): any => value),
    },
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
  return jest.fn((): string => faker.lorem.words())
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

/**
 * creates a fake fulfilled Interceptor
 */
export const createFakeFulfilledInterceptor = (): Function => {
  return jest.fn((result: any): Promise<any> => Promise.resolve(result))
}

/**
 * creates a fake rejected Interceptor
 */
export const createFakeRejectedInterceptor = (): Function => {
  return jest.fn((error: any): Promise<any> => Promise.reject(error))
}
