import { isObject } from '../utils'
import {
  FieldDeclaration,
  FieldTransformer,
  OptionalFieldTransformer,
} from '../types/fields'

/**
 * Checks if the value implements FieldDeclaration
 *
 * @param value
 */
const isOptionalFieldDeclaration = (value: any): value is FieldDeclaration =>
  isObject(value) && typeof value.value !== 'undefined'

/**
 * Generate a label from the field key
 *
 * @param fieldKey
 */
const generateDefaultLabel = (fieldKey: string): string =>
  fieldKey
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
    .replace(/([A-Z])/g, (str): string => str.toLowerCase())
    .replace(/^./, (str): string => str.toUpperCase())

/**
 * generate a FieldTransformer from a OptionalFieldTransformer
 *
 * @param transformDeclaration
 */
const generateTransformer = (
  transformDeclaration: OptionalFieldTransformer
): FieldTransformer => {
  return {
    transformIn: transformDeclaration.transformIn
      ? transformDeclaration.transformIn
      : <T>(value: T): T => value,
    transformOut: transformDeclaration.transformOut
      ? transformDeclaration.transformOut
      : <T>(value: T): T => value,
  }
}

/**
 * returns a FieldDeclaration from value or FieldDeclaration
 *
 * @param fieldKey
 * @param value
 */
export default (fieldKey: string, value: any): FieldDeclaration => {
  return isOptionalFieldDeclaration(value)
    ? {
        value: value.value,
        label: value.label || generateDefaultLabel(fieldKey),
        rules: value.rules || [],
        extra: value.extra || {},
        transformer: generateTransformer(value.transformer || {}),
      }
    : {
        value,
        label: generateDefaultLabel(fieldKey),
        rules: [],
        extra: {},
        transformer: generateTransformer({}),
      }
}
