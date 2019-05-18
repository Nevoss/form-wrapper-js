import { Form } from '../core/Form'
import { Rules } from '../core/Rules'
import { Errors } from '../core/Errors'
import { Interceptors } from '../core/Interceptors'
import { uniqueId } from '../utils'
import { FieldsDeclaration } from '../types/fields'
import { OptionalOptions } from '../types/options'
import { FormWithFields } from '../types/form'
import basicInterceptors from '../interceptors/index'
import { Collection } from '../helpers/Collection'

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
    overrideDependencies.rules ? overrideDependencies.rules : new Rules(),
    overrideDependencies.errors ? overrideDependencies.errors : new Errors(),
    overrideDependencies.touched
      ? overrideDependencies.touched
      : new Collection(),
    overrideDependencies.validating
      ? overrideDependencies.validating
      : new Collection(),
    createInterceptors()
  )

  form.$assignOptions(options)
  form.$addFields(fields)

  return form
}
