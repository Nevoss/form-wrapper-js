import { Form } from './core/Form'
import { FormCollection } from './core/FormCollection'
import { ConditionalRules } from './core/ConditionalRules'
import { RuleValidationError } from './errors/RuleValidationError'

const createForm = Form.create
const createFormCollection = FormCollection.create
const applyRulesIf = ConditionalRules.create

export {
  Form,
  FormCollection,
  ConditionalRules,
  RuleValidationError,
  createForm,
  createFormCollection,
  applyRulesIf,
}
