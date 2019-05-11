/**
 * An interface for a flexible object
 * that all his property with the same type
 */
export interface Items<T> {
  [key: string]: T
}
