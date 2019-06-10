import basicInterceptors from '../interceptors'
import { Interceptors } from '../core/Interceptors'
import { Form } from '../core/Form'

/**
 * creates an interceptors object for the Form
 */
export default (): {
  beforeSubmission: Interceptors
  submissionComplete: Interceptors
} => {
  return {
    beforeSubmission: new Interceptors([
      ...basicInterceptors.beforeSubmission,
      ...Form.defaults.interceptors.beforeSubmission.all(),
    ]),
    submissionComplete: new Interceptors([
      ...basicInterceptors.submissionComplete,
      ...Form.defaults.interceptors.submissionComplete.all(),
    ]),
  }
}
