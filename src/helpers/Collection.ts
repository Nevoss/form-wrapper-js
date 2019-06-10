export class Collection<T> {
  /**
   * items
   */
  public keys: T[] = []

  /**
   * returns all the field keys
   */
  public all(): T[] {
    return this.keys
  }

  /**
   * fill the keys
   *
   * @param keys
   */
  public fill(keys: T[]): this {
    this.keys = [...keys]

    return this
  }

  /**
   * checks if key exists in the keys
   *
   * @param key
   */
  public has(key: T): boolean {
    return this.keys.indexOf(key) > -1
  }

  /**
   * push key to the keys array
   *
   * @param key
   */
  public push(key: T): this {
    if (!this.has(key)) {
      this.keys.push(key)
    }

    return this
  }

  /**
   * Clear the keys
   */
  public clear(): this {
    this.keys = []

    return this
  }

  /**
   * checks if there is any key
   */
  public any(): boolean {
    return this.keys.length > 0
  }

  /**
   * remove key from the keys
   *
   * @param key
   */
  public unset(key: T): this {
    if (this.has(key)) {
      this.keys = this.keys.filter(
        (existingKey: T): boolean => existingKey !== key
      )
    }

    return this
  }
}
