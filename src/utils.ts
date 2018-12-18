/**
 * check if value is an object and only object
 *
 * @param value
 */
export const isObject = (value: any): boolean => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * sending a warning message
 *
 * @param message
 */
export const warn = (message): void => {
  console.error(`[Form-wrapper-js warn]: ${message}`)
}
