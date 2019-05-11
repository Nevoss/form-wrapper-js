import { Form } from '../core/Form'
import { Rules } from '../core/Rules'
import { Errors } from '../core/Errors'
import { Interceptors } from '../core/Interceptors'
import { uniqueId } from '../utils'
import { FieldsDeclaration } from '../types/fields'
import { OptionalOptions } from '../types/options'
import { FormWithFields } from '../types/form'

export default (
  fields: FieldsDeclaration = {},
  options: OptionalOptions = {}
): FormWithFields => {
  const form = new Form(uniqueId(), new Rules(), new Errors(), {
    beforeSubmission: new Interceptors(),
    submissionComplete: new Interceptors(),
  })

  form.$assignOptions(options)
  form.$addFields(fields)

  return form
}
