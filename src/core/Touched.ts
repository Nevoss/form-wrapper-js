export class Touched {
  /**
   * holds all the touched fields
   */
  $touched: string[] = []

  /**
   * returns all the touched fields
   */
  public all(): string[] {
    return this.$touched
  }

  /**
   * record fields keys on $touched array
   *
   * @param fieldsKeys
   */
  public record(fieldsKeys: string[]): Touched {
    this.$touched = [...fieldsKeys]

    return this
  }

  /**
   * checks if field has been touched
   *
   * @param fieldKey
   */
  public has(fieldKey: string): boolean {
    return this.$touched.indexOf(fieldKey) > -1
  }

  /**
   * push field to the touched array
   *
   * @param fieldKey
   */
  public push(fieldKey: string): Touched {
    if (this.$touched.indexOf(fieldKey) < 0) {
      this.$touched.push(fieldKey)
    }

    return this
  }

  /**
   * Clear the $touched array
   */
  public clear(): Touched {
    this.$touched = []

    return this
  }

  /**
   * checks if there is any touched fields
   */
  public any(): boolean {
    return this.$touched.length > 0
  }

  /**
   * remove field from the $touched array
   *
   * @param fieldKey
   */
  public unset(fieldKey: string): Touched {
    if (this.has(fieldKey)) {
      this.$touched = this.$touched.filter(
        touchedFieldKey => touchedFieldKey !== fieldKey
      )
    }

    return this
  }
}
