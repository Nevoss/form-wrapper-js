import { Form } from './Form'
import createForm from '../factories/FormFactory'
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
   * The Form that is the parent of the collection of forms
   */
  public parent: Form | null = null

  /**
   * the field on the parent form that holds the collection
   */
  public fieldKey: string = ''

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
    if (!this.parent) {
      throw new Error(
        'FormCollection must have parent Form, something went wrong.'
      )
    }

    const form = createForm(this.prototype, this.prototypeOptions, {
      errors: this.parent.$errors,
      touched: this.parent.$touched,
      validating: this.parent.$validating,
    })

    const formsLength = this.forms.push(form)

    form.$fieldsPrefix = `${this.fieldKey}.${formsLength - 1}.`

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
   *
   * @param useTransformers
   */
  public values(useTransformers: boolean = true): ({ [key: string]: any })[] {
    return this.forms.map(
      (form: Form): { [key: string]: any } => {
        return form.$values(useTransformers)
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
   * @param useTransformers
   */
  public fill(
    data: ({ [key: string]: any })[],
    updateInitialValues: boolean = false,
    useTransformers: boolean = true
  ): FormCollection {
    this.clear()

    if (updateInitialValues) {
      this._initialFormsIds = []
    }

    data.forEach(
      (data: { [key: string]: any }): void => {
        const form = this.add().$fill(
          data,
          updateInitialValues,
          useTransformers
        )

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
