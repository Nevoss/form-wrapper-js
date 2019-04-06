import { FieldOptions } from '../types/Field'
import { isFieldOptions } from '../utils'
import generateDefaultLabel from './generateDefaultLabel'

export default (fieldKey: string, value: any | FieldOptions): FieldOptions => {
  return isFieldOptions(value)
    ? {
        value: value.value,
        label: value.label ? value.label : generateDefaultLabel(fieldKey),
        rules: value.rules ? value.rules : [],
        extra: value.extra ? value.extra : {},
      }
    : {
        value,
        label: generateDefaultLabel(fieldKey),
        rules: [],
        extra: {},
      }
}
