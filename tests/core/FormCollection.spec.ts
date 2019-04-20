import { Form, FormCollection } from '../../src'
import { RawFormFields } from '../../src/types/Field'
import { Options } from '../../src/types/Options'
import { uniqueId } from '../../src/utils'

jest.mock('../../src/core/Form')

describe('FormCollection.ts', () => {
  let prototype: RawFormFields = { name: null }
  let prototypeOptions: Options = {
    validation: { onSubmission: true },
  }

  it('should construct correctly', () => {
    const formCollection = new FormCollection(prototype, prototypeOptions)

    expect(formCollection.$prototype).toEqual(prototype)
    expect(formCollection.$prototypeOptions).toEqual(prototypeOptions)
  })

  it('should add a form to the forms array', () => {
    const formCollection = new FormCollection()

    formCollection.$prototype = prototype
    formCollection.$prototypeOptions = prototypeOptions

    expect(formCollection.$forms).toBeEmpty()

    let form = formCollection.add()

    expect(Form).toHaveBeenCalledWith(
      formCollection.$prototype,
      formCollection.$prototypeOptions
    )
    expect(formCollection.$forms.length).toBe(1)
    expect(formCollection.$forms[0]).toBeInstanceOf(Form)
    expect(form).toBeInstanceOf(Form)
  })

  it('should remove a form by his index', () => {
    const formCollection = new FormCollection(prototype, prototypeOptions)

    formCollection.add()
    formCollection.add()

    const firstFormId = (formCollection.$forms[0].$id = uniqueId())
    formCollection.$forms[1].$id = uniqueId()

    expect(formCollection.$forms.length).toBe(2)

    formCollection.remove(1)

    expect(formCollection.$forms.length).toBe(1)
    expect(formCollection.$forms[0].$id).toBe(firstFormId)
  })

  it('should remove a form by his id', () => {
    const formCollection = new FormCollection(prototype, prototypeOptions)

    formCollection.add()
    formCollection.add()

    const firstFormId = (formCollection.$forms[0].$id = uniqueId())
    const secFormId = (formCollection.$forms[1].$id = uniqueId())

    expect(formCollection.$forms.length).toBe(2)

    formCollection.removeById(secFormId)

    expect(formCollection.$forms.length).toBe(1)
    expect(formCollection.$forms[0].$id).toBe(firstFormId)
  })

  it('should return all the forms in the collection', () => {
    const formCollection = new FormCollection(prototype, prototypeOptions)

    formCollection.add()
    formCollection.add()

    const forms = formCollection.all()

    expect.assertions(3)

    expect(forms.length).toBe(2)
    forms.forEach(form => expect(form).toBeInstanceOf(Form))
  })

  it('should remove all the forms from the array', () => {
    const formCollection = new FormCollection(prototype, prototypeOptions)

    formCollection.add()
    formCollection.add()

    formCollection.clear()

    expect(formCollection.$forms.length).toBe(0)
  })

  it('should fill the forms in data', () => {
    const mockValues = [{ name: '1' }, { name: '2' }, { name: '3' }]

    const formCollection = new FormCollection(prototype, prototypeOptions)

    formCollection.fill(mockValues)

    expect.assertions(4)

    expect(formCollection.all().length).toBe(3)
    formCollection.all().forEach((form: Form, index) => {
      expect(form.$fill).toHaveBeenCalledWith(mockValues[index])
    })
  })

  it('should get all the forms values as array', () => {
    const mockValues = [{ name: '1' }, { name: '2' }, { name: '3' }]

    const formCollection = new FormCollection(prototype, prototypeOptions)
    formCollection.fill(mockValues)

    const values = formCollection.values()

    expect.assertions(4)

    expect(values.length).toBe(3)
    formCollection.all().forEach((form: Form) => {
      expect(form.$values).toHaveBeenCalled()
    })
  })
})
