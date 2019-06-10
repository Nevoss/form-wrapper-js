import { Items } from '../types/helpers'

export class FieldsCollection<T> {
  /**
   * Fields as keys and the value is flexible
   */
  public items: Items<T> = {}

  /**
   * Constructor
   *
   * @param items
   */
  public constructor(items: Items<T> = {}) {
    this.fill(items)
  }

  /**
   * return all teh items
   */
  public all(): Items<T> {
    return this.items
  }

  /**
   * Checks if there is any item in the items object
   */
  public any(): boolean {
    return Object.keys(this.items).length > 0
  }

  /**
   * Fill the items object with new items
   *
   * @param items
   */
  public fill(items: Items<T>): this {
    this.items = {
      ...items,
    }

    return this
  }

  /**
   * merge new items to the end of the items object
   *
   * @param items
   */
  public merge(items: Items<T>): this {
    this.items = {
      ...this.items,
      ...items,
    }

    return this
  }

  /**
   * Checks if key is exists in the items object
   *
   * @param key
   */
  public has(key: string): boolean {
    return this.items.hasOwnProperty(key)
  }

  /**
   * Get an one item value or defaultValue
   *
   * @param key
   * @param defaultValue
   */
  public get<D>(key: string, defaultValue: D): T | D {
    if (!this.has(key)) {
      return defaultValue
    }

    return this.items[key]
  }

  /**
   * Remove an item from the items object if exists
   *
   * @param key
   */
  public unset(key: string): this {
    if (!this.has(key)) {
      return this
    }

    delete this.items[key]

    this.items = {
      ...this.items,
    }

    return this
  }

  /**
   * Clear the items object
   */
  public clear(): this {
    this.items = {}

    return this
  }
}
