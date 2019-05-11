import { RuleMessageFunction } from '../types/validation'

/**
 * Return RuleMessageFunction from string of function
 *
 * @param message
 */
export default (message: string | RuleMessageFunction): RuleMessageFunction => {
  return typeof message === 'function' ? message : (): string => message
}
