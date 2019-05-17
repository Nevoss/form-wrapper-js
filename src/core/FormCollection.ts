import { Form } from './Form'
import { OptionalOptions } from '../types/Options'
import { FieldsDeclaration } from '../types/fields'
import { FormWithFields } from '../types/form'

export class FormCollection {
  /**
   * a shortcut to create FormCollection
   *
   * @param prototype
   * @param prototypeOptions
   */
  public static create(
    prototype: FieldsDeclaration = {},
    prototypeOptions: OptionalOptions = {}
  ): FormCollection {
    return new FormCollection(prototype, prototypeOptions)
  }

  /**
   * The prototype for a Form item
   */
  public prototype: FieldsDeclaration

  /**
   * The options for a Form item
   */
  public prototypeOptions: OptionalOptions

  /**
   * The forms array - holds the current Forms
   */
  public forms: FormWithFields[] = []

  /**
   * Holds the ids of the forms that was declared as initials forms.
   * The main reason is to make a compare between the new forms and the initials
   * forms and then see if the form collection is dirty or not
   * (take a look at `isDirty` method)
   */
  private _initialFormsIds: string[] = []

  /**
   * Constructor
   *
   * @param prototype
   * @param prototypeOptions
   */
  public constructor(
    prototype: FieldsDeclaration = {},
    prototypeOptions: OptionalOptions = {}
  ) {
    this.prototype = prototype
    this.prototypeOptions = prototypeOptions
  }

  /**
   * Return the all the forms
   */
  public all(): FormWithFields[] {
    return this.forms
  }

  /**
   * Clear the forms array
   */
  public clear(): FormCollection {
    this.forms = []

    return this
  }

  /**
   * Add new form to the forms array
   */
  public add(): FormWithFields {
    const form = Form.create(this.prototype, this.prototypeOptions)

    this.forms.push(form)

    return form
  }

  /**
   * Remove a form from the forms array by his index
   *
   * @param index
   */
  public remove(index: number): FormCollection {
    this.forms = this.forms.filter(
      (form: Form, key: number): boolean => index !== key
    )

    return this
  }

  /**
   * Remove a form from the forms array by his id
   *
   * @param id
   */
  public removeById(id: string): FormCollection {
    this.forms = this.forms.filter((form: Form): boolean => form.$id !== id)

    return this
  }

  /**
   * return all the values of the forms in array
   */
  public values(): ({ [key: string]: any })[] {
    return this.forms.map(
      (form: Form): { [key: string]: any } => {
        return form.$values()
      }
    )
  }

  /**
   * Fill the form inside the collection.
   * if the flag updateInitialValues is passes as true
   * it will update the _initialFormsIds to make a compare if
   * `isDirty` called
   *
   * @param data
   * @param updateInitialValues
   */
  public fill(
    data: ({ [key: string]: any })[],
    updateInitialValues: boolean = false
  ): FormCollection {
    this.clear()

    if (updateInitialValues) {
      this._initialFormsIds = []
    }

    data.forEach(
      (data: { [key: string]: any }): void => {
        const form = this.add().$fill(data, updateInitialValues)

        if (updateInitialValues) {
          this._initialFormsIds.push(form.$id)
        }
      }
    )

    return this
  }

  /**
   * Checks id the FormCollection is dirty or not
   */
  public isDirty(): boolean {
    return (
      this._initialFormsIds.length !== this.forms.length ||
      this.forms.some(
        (form: Form): boolean =>
          !this._initialFormsIds.includes(form.$id) || form.$isFormDirty()
      )
    )
  }

  /**
   * Returns _initialFormsIds
   */
  public getInitialFormsIds(): string[] {
    return this._initialFormsIds
  }

  /**
   * validate all the forms inside the collection
   */
  public validate(): Promise<any> {
    const promises = this.forms.map(
      (form: Form): Promise<any> => {
        return form.$validateForm()
      }
    )

    return Promise.all(promises)
  }
}
