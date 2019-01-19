import { MessageFunction } from '../types/Errors'
import { warn } from '../utils'

/**
 * generate MessageFunction from string or function
 *
 * @param message
 */
export default (message: string | MessageFunction): MessageFunction => {
  let messageType: string = typeof message

  if (messageType !== 'function' && messageType !== 'string') {
    warn('`message` property must be a function or a string.')
  }

  return typeof message === 'function' ? message : () => message
}
