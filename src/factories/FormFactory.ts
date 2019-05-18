import { Form } from '../core/Form'
import { Rules } from '../core/Rules'
import { Errors } from '../core/Errors'
import { Interceptors } from '../core/Interceptors'
import { uniqueId } from '../utils'
import { FieldsDeclaration } from '../types/fields'
import { OptionalOptions } from '../types/options'
import { FormWithFields } from '../types/form'
import basicInterceptors from '../interceptors/index'

const createInterceptors = (): {
  beforeSubmission: Interceptors
  submissionComplete: Interceptors
} => {
  const interceptors = {
    beforeSubmission: new Interceptors(
      Form.defaults.interceptors.beforeSubmission.all()
    ),
    submissionComplete: new Interceptors(
      Form.defaults.interceptors.beforeSubmission.all()
    ),
  }

  interceptors.beforeSubmission.merge(basicInterceptors.beforeSubmission)
  interceptors.submissionComplete.merge(basicInterceptors.submissionComplete)

  return interceptors
}

export default (
  fields: FieldsDeclaration = {},
  options: OptionalOptions = {}
): FormWithFields => {
  const form = new Form(
    uniqueId(),
    new Rules(),
    new Errors(),
    createInterceptors()
  )

  form.$assignOptions(options)
  form.$addFields(fields)

  return form
}
