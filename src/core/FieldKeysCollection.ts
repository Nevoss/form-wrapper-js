export class FieldKeysCollection {
  /**
   * holds all the field keys
   */
  $fieldKeys: string[] = []

  /**
   * returns all the field keys
   */
  public all(): string[] {
    return this.$fieldKeys
  }

  /**
   * record fields keys on $fieldKeys array
   *
   * @param fieldsKeys
   */
  public record(fieldsKeys: string[]): FieldKeysCollection {
    this.$fieldKeys = [...fieldsKeys]

    return this
  }

  /**
   * checks if field exists in $fieldKeys array
   *
   * @param fieldKey
   */
  public has(fieldKey: string): boolean {
    return this.$fieldKeys.indexOf(fieldKey) > -1
  }

  /**
   * push field to the $fieldKeys array
   *
   * @param fieldKey
   */
  public push(fieldKey: string): FieldKeysCollection {
    if (this.$fieldKeys.indexOf(fieldKey) < 0) {
      this.$fieldKeys.push(fieldKey)
    }

    return this
  }

  /**
   * Clear the $fieldKeys array
   */
  public clear(): FieldKeysCollection {
    this.$fieldKeys = []

    return this
  }

  /**
   * checks if there is any field key
   */
  public any(): boolean {
    return this.$fieldKeys.length > 0
  }

  /**
   * remove field from the $fieldKeys array
   *
   * @param fieldKey
   */
  public unset(fieldKey: string): FieldKeysCollection {
    if (this.has(fieldKey)) {
      this.$fieldKeys = this.$fieldKeys.filter(
        existsFieldKey => existsFieldKey !== fieldKey
      )
    }

    return this
  }
}
