/**
 * generate default label for field
 *
 * @param fieldKey
 * @returns {*|void|string}
 */
export default fieldKey => {
  return fieldKey
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
    .replace(/([A-Z])/g, str => str.toLowerCase())
    .replace(/^./, str => str.toUpperCase())
}
