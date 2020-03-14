import { OptionalOptions, Options } from '../types/options'
import { isObject } from '../utils'

/**
 * recursive functions that overwrite the Options object
 *
 * @param originOptions
 * @param newOptions
 */
const assignNewOptions = (
  originOptions: object,
  newOptions: object
): object => {
  let options = {}

  Object.keys(originOptions).forEach((key): void | undefined => {
    if (!newOptions.hasOwnProperty(key)) {
      options[key] = originOptions[key]
      return
    }

    if (isObject(newOptions[key])) {
      options[key] = assignNewOptions(originOptions[key], newOptions[key])
      return
    }

    options[key] = newOptions[key]
  })

  return options
}

/**
 * generate Options base on the defaultOptions Options and new options
 * must ignore ts here - because I know that the result will be an Options
 * interface - Let me know if there is some way to do it without ignore
 *
 * @param defaultOptions
 * @param overwriteOptions
 */
export default (
  defaultOptions: Options,
  overwriteOptions: OptionalOptions
): Options => {
  // @ts-ignore
  return assignNewOptions(defaultOptions, overwriteOptions)
}
