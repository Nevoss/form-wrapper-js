/**
 * check if value is an object and only object
 *
 * @param value
 */
export const isObject = (value: any): boolean => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * merging deep 2 objects
 *
 * @param target
 * @param source
 */
export const mergeDeep = (target: Object, source: Object): Object => {
  let output = { ...target }

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output = { ...output, [key]: source[key] }
        } else {
          output[key] = mergeDeep(target[key], source[key])
        }

      } else {
        output = { ...output, [key]: source[key] }
      }
    })
  }

  return output
}
