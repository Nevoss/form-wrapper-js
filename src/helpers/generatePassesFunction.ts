import { Form } from '../core/Form'
import { RuleValidationError } from '../errors/RuleValidationError'
import { warn } from '../utils'
import { PassesFunction } from '../types/Errors'
import { Field } from '../types/Field'

/**
 * generate PassesFunction from regular function that should returns boolean
 *
 * @param func
 */
export default (func: Function): PassesFunction => {
  if (typeof func !== 'function') {
    warn('`passes` property or `rule` function must be a function.')
  }

  return (field: Field, form: Form) => {
    return new Promise((resolve, reject) => {
      const funcResult = func(field, form)
      if (funcResult instanceof Promise) {
        warn(
          'validation function returns a promise, did you forgot to set `returnsPromise` to true?'
        )
      }

      return funcResult ? resolve() : reject(new RuleValidationError())
    })
  }
}
