import { Form } from '../core/Form'
import { Rules } from '../core/Rules'
import { Errors } from '../core/Errors'
import { Interceptors } from '../core/Interceptors'
import { uniqueId } from '../utils'
import { FieldsDeclaration } from '../types/fields'
import { OptionalOptions } from '../types/options'
import { FormWithFields } from '../types/form'
import interceptors from '../interceptors/index'

export default (
  fields: FieldsDeclaration = {},
  options: OptionalOptions = {}
): FormWithFields => {
  const form = new Form(uniqueId(), new Rules(), new Errors(), {
    beforeSubmission: new Interceptors(interceptors.beforeSubmission),
    submissionComplete: new Interceptors(interceptors.submissionComplete),
  })

  form.$assignOptions(options)
  form.$addFields(fields)

  return form
}
