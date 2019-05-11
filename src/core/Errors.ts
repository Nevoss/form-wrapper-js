import { FieldsCollection } from '../helpers/FieldsCollection'

export class Errors extends FieldsCollection<string[]> {
  /**
   * return the first error of specific field
   *
   * @param key
   * @param defaultValue
   */
  public getFirst<T>(
    key: string,
    defaultValue: T | null = null
  ): string | T | null {
    const errors = this.get(key)

    return errors.length > 0 && Array.isArray(errors) ? errors[0] : defaultValue
  }

  /**
   * override `get` method to return an empty array if there is no errors
   * for the requested field
   *
   * @param key
   */
  public get(key: string): string[] {
    return super.get(key, [])
  }
}
