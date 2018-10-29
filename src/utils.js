/**
 * check if value is an object and only object
 *
 * @param value
 * @returns {boolean}
 */
export const isObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * merging deep 2 objects
 *
 * @param target
 * @param source
 * @returns {*}
 */
export const mergeDeep = (target, source) => {
  let output = Object.assign({}, target)

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] })
        } else {
          output[key] = mergeDeep(target[key], source[key])
        }

      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }

  return output
}
