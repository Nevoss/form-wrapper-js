import { Form } from '../core/Form'
import { Rules } from '../core/Rules'
import { Errors } from '../core/Errors'
import { uniqueId } from '../utils'
import { FieldsDeclaration } from '../types/fields'
import { OptionalOptions } from '../types/options'
import { FormWithFields } from '../types/form'
import { Collection } from '../helpers/Collection'
import createInterceptors from './InterceptorsFactory'

export default (
  fields: FieldsDeclaration = {},
  options: OptionalOptions = {},
  overrideDependencies: {
    rules?: Rules
    errors?: Errors
    touched?: Collection<string>
    validating?: Collection<string>
  } = {}
): FormWithFields => {
  const form = new Form(
    uniqueId(),
    overrideDependencies.rules || new Rules(),
    overrideDependencies.errors || new Errors(),
    overrideDependencies.touched || new Collection(),
    overrideDependencies.validating || new Collection(),
    createInterceptors()
  )

  form.$assignOptions(options)
  form.$addFields(fields)

  return form
}
