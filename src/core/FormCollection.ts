import { Form } from './Form'
import { RawFormFields } from '../types/Field'
import { Options } from '../types/Options'

export class FormCollection {
  /**
   * The prototype for the a form item
   */
  public $prototype: RawFormFields

  /**
   * The options for the form item
   */
  public $prototypeOptions: Options

  /**
   * The forms array - holds the current Forms
   */
  public $forms: Form[] = []

  /**
   * Constructor
   *
   * @param prototype
   * @param prototypeOptions
   */
  constructor(prototype: RawFormFields = {}, prototypeOptions: Options = {}) {
    this.$prototype = prototype
    this.$prototypeOptions = prototypeOptions
  }

  /**
   * Return the all the forms
   */
  public all(): Form[] {
    return this.$forms
  }

  /**
   * Clear the forms array
   */
  public clear(): FormCollection {
    this.$forms = []

    return this
  }

  /**
   * Add new form to the forms array
   */
  public add(): Form {
    const form = new Form(this.$prototype, this.$prototypeOptions)

    this.$forms.push(form)

    return form
  }

  /**
   * Remove a form from the forms array by his index
   *
   * @param index
   */
  public remove(index: number): FormCollection {
    this.$forms = this.$forms.filter(
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
    this.$forms = this.$forms.filter((form: Form): boolean => form.$id !== id)

    return this
  }

  /**
   * return all the values of the forms in array
   */
  public values(): Object[] {
    return this.$forms.map((form: Form) => {
      return form.$values()
    })
  }

  /**
   * Filling the forms with data
   *
   * @param data
   */
  public fill(data: Object[]): FormCollection {
    data.forEach((data: Object) => {
      this.add().$fill(data)
    })

    return this
  }
}
