/**
 * Generate a good enough unique ID
 */

export const uniqueId = (): string => {
  return String(Date.now() + Math.random())
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
 * determine if value is a boolean
 *
 * @param value
 */
export const isBoolean = (value: any): value is boolean => {
  return typeof value === 'boolean'
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
 * convert an object to FormData object
 * Thanks to this gist: https://gist.github.com/ghinda/8442a57f22099bdb2e34
 *
 * @param values
 * @param contextFormData
 * @param namespace
 */
export const objectToFormData = (
  values: object | [],
  contextFormData?: FormData,
  namespace?: string
): FormData => {
  const formData: FormData = contextFormData || new FormData()

  Object.keys(values).forEach(
    (key: string): void => {
      const value = values[key]
      key = namespace ? `${namespace}[${key}]` : key

      if ([undefined, false, null].indexOf(value) > -1) {
        return
      }

      if (
        (isObject(value) && !(value instanceof File)) ||
        Array.isArray(value)
      ) {
        objectToFormData(value, formData, key)
        return
      }

      formData.append(key, value)
    }
  )

  return formData
}

/**
 * debounce function
 *
 * @param callback
 * @param time
 */
export const debounce = (
  callback: (...args: any[]) => void,
  time?: number
): ((...args: any[]) => void) => {
  let interval

  return (...args): void => {
    clearTimeout(interval)
    interval = setTimeout((): void => {
      interval = null

      callback(...args)
    }, time)
  }
}
