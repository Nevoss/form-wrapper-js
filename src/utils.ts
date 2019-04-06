import { RawRule } from './types/Validator'
import { FieldOptions } from './types/Field'

/**
 * determine if value is a boolean
 *
 * @param value
 */
export const isBoolean = (value: any): value is boolean => {
  return typeof value === 'boolean'
}

/**
 * check if value is an object and only object
 *
 * @param value
 */
export const isObject = (value: any): boolean => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * determine if value is a Promise
 *
 * @param value
 */
export const isPromise = (value: any): value is Promise<any> => {
  return !!value && isObject(value) && typeof value.then === 'function'
}

/**
 * checks if value implements implements RawRule interface
 *
 * @param value
 */
export const isRawRule = (value: any): value is RawRule => {
  return isObject(value) && value.passes
}

/**
 * checks if value implements FieldOption interface
 *
 * @param value
 */
export const isFieldOptions = (value: any): value is FieldOptions => {
  return isObject(value) && value.value
}

/**
 * sending a warning message
 *
 * @param message
 */
export const warn = (message): void => {
  console.error(`[Form-wrapper-js warn]: ${message}`)
}

/**
 * debounce function
 *
 * @param callback
 * @param time
 */
export const debounce = (callback: Function, time: number): Function => {
  let interval

  return (...args) => {
    clearTimeout(interval)
    interval = setTimeout(() => {
      interval = null

      callback(...args)
    }, time)
  }
}
