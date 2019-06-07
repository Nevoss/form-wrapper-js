import generateFieldDeclaration from '../../../src/helpers/generateFieldDeclaration'

describe('helpers/generateFieldDeclaration.ts', (): void => {
  it('should generate FieldDeclaration from only value', (): void => {
    const fieldDeclaration = generateFieldDeclaration('name', 'Nevo')

    expect(fieldDeclaration).toEqual({
      value: 'Nevo',
      label: 'Name',
      rules: [],
      extra: {},
    })
  })

  it('should generate FieldDeclaration with only value in the object', (): void => {
    const fieldDeclaration = generateFieldDeclaration('last_name', {
      value: 'a',
    })

    expect(fieldDeclaration).toEqual({
      value: 'a',
      label: 'Last name',
      rules: [],
      extra: {},
    })
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

    expect(fieldDeclaration).toEqual(basicFieldDeclaration)
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

    expect(fieldDeclaration).toEqual({
      ...basicFieldDeclaration,
      label: 'Last name',
    })
  })
})
