import { Form } from './core/Form'
import { FormCollection } from './core/FormCollection'
import { ConditionalRules } from './core/ConditionalRules'

const createForm = Form.create
const createFormCollection = FormCollection.create
const applyRulesIf = ConditionalRules.create

export {
  Form,
  FormCollection,
  ConditionalRules,
  createForm,
  createFormCollection,
  applyRulesIf,
}
