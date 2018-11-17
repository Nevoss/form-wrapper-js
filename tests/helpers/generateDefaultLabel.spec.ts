import generateDefaultLabel from '../../src/helpers/generateDefaultLabel'

describe('generateDefaultLabel.js', () => {
  it('should generate a good default label to field key', () => {
    expect(generateDefaultLabel('name')).toBe('Name')
    expect(generateDefaultLabel('last_name')).toBe('Last name')
    expect(generateDefaultLabel('lastName')).toBe('Last name')
  });
})
