export class FieldKeysCollection {
  /**
   * field keys
   */
  public keys: string[] = []

  /**
   * returns all the field keys
   */
  public all(): string[] {
    return this.keys
  }

  /**
   * fill the keys
   *
   * @param keys
   */
  public fill(keys: string[]): FieldKeysCollection {
    this.keys = [...keys]

    return this
  }

  /**
   * checks if key exists in the keys
   *
   * @param key
   */
  public has(key: string): boolean {
    return this.keys.indexOf(key) > -1
  }

  /**
   * push key to the keys array
   *
   * @param key
   */
  public push(key: string): FieldKeysCollection {
    if (!this.has(key)) {
      this.keys.push(key)
    }

    return this
  }

  /**
   * Clear the keys
   */
  public clear(): FieldKeysCollection {
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
  public unset(key: string): FieldKeysCollection {
    if (this.has(key)) {
      this.keys = this.keys.filter(
        (existingKey: string): boolean => existingKey !== key
      )
    }

    return this
  }
}
