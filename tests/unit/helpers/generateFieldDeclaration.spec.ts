import generateFieldDeclaration from '../../../src/helpers/generateFieldDeclaration'
import { Form } from '../../../src/core/Form'

jest.mock('../../../src/core/Form')

describe('helpers/generateFieldDeclaration.ts', (): void => {
  it('should generate FieldDeclaration from only value', (): void => {
    const fieldDeclaration = generateFieldDeclaration('name', 'Nevo')

    expect(fieldDeclaration).toEqual(
      expect.objectContaining({
        value: 'Nevo',
        label: 'Name',
        rules: [],
        extra: {},
      })
    )
  })

  it('should generate FieldDeclaration with only value in the object', (): void => {
    const fieldDeclaration = generateFieldDeclaration('last_name', {
      value: 'a',
    })

    expect(fieldDeclaration).toEqual(
      expect.objectContaining({
        value: 'a',
        label: 'Last name',
        rules: [],
        extra: {},
      })
    )
  })

  it('should generate FieldDeclaration with full FieldDeclaration', (): void => {
    const basicFieldDeclaration = {
      value: 'a',
      label: 'A',
      rules: [jest.fn()],
      extra: { a: 1 },
    }

    const fieldDeclaration = generateFieldDeclaration(
      'lastName',
      basicFieldDeclaration
    )

    expect(fieldDeclaration).toEqual(
      expect.objectContaining(basicFieldDeclaration)
    )
  })

  it('should generate FieldDeclaration with full FieldDeclaration without label', (): void => {
    const basicFieldDeclaration = {
      value: 'a',
      rules: [jest.fn()],
      extra: { a: 1 },
    }

    const fieldDeclaration = generateFieldDeclaration(
      'lastName',
      basicFieldDeclaration
    )

    expect(fieldDeclaration).toEqual(
      expect.objectContaining({
        ...basicFieldDeclaration,
        label: 'Last name',
      })
    )
  })

  it('should generate transformer with semi FieldDeclaration', (): void => {
    const transformer = {
      transform: value => value + 1,
      reverseTransform: value => value - 1,
    }

    const fieldDeclaration = generateFieldDeclaration('name', {
      value: 'a',
      transformer,
    })

    expect(fieldDeclaration.transformer).toStrictEqual(transformer)
  })

  it('should generate a default transformer if transformer not declared', () => {
    const fieldDeclaration = generateFieldDeclaration('name', {
      value: 'a',
    })

    const value = {}

    const fakeForm = Form.create()

    expect(fieldDeclaration.transformer.transform(value, fakeForm)).toBe(value)
    expect(fieldDeclaration.transformer.reverseTransform(value, fakeForm)).toBe(
      value
    )
  })
})
