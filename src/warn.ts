const isProduction: boolean = process.env.NODE_ENV === 'production'

/**
 * warn an error of the condition is true and the NODE_ENV is not production
 *
 * @param condition
 * @param message
 */
export default (condition: boolean, message: string): void => {
  if (isProduction || condition) {
    return
  }

  console.warn(`[Form-wrapper-js warn]: ${message}`)
}
