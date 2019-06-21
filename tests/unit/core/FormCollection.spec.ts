import { FormCollection } from '../../../src/core/FormCollection'
import { Form } from '../../../src/core/Form'
import { uniqueId } from '../../../src/utils'
import { mocked } from 'ts-jest/utils'

describe('core/FormCollection.ts', (): void => {
  let prototype = { name: null }
  let prototypeOptions = {
    validation: { onSubmission: true },
  }

  const createFormCollection = () => {
    const mockParentForm = Form.create()
    const formCollection = new FormCollection(prototype, prototypeOptions)

    formCollection.parent = mockParentForm

    return formCollection
  }

  it('should create FormCollection from the create static method', (): void => {
    const formCollection = createFormCollection()

    expect(formCollection).toBeInstanceOf(FormCollection)
  })

  it('should construct correctly', (): void => {
    const formCollection = createFormCollection()

    expect(formCollection.prototype).toEqual(prototype)
    expect(formCollection.prototypeOptions).toEqual(prototypeOptions)
  })

  it('should add a form to the forms array', (): void => {
    const mockParentForm = Form.create()
    const mockFieldKey = 'aaa'

    const formCollection = new FormCollection()

    formCollection.parent = mockParentForm
    formCollection.fieldKey = mockFieldKey
    formCollection.prototype = prototype
    formCollection.prototypeOptions = prototypeOptions

    expect(formCollection.forms.length).toBe(0)

    let form = formCollection.add()

    expect(formCollection.forms.length).toBe(1)
    expect(formCollection.forms[0]).toBeInstanceOf(Form)
    expect(formCollection.forms[0].$errors).toBe(formCollection.parent.$errors)
    expect(formCollection.forms[0].$touched).toBe(
      formCollection.parent.$touched
    )
    expect(formCollection.forms[0].$validating).toBe(
      formCollection.parent.$validating
    )
    expect(formCollection.forms[0].$fieldsPrefix).toBe(`${mockFieldKey}.0.`)
    expect(form).toBeInstanceOf(Form)
  })

  it('should throw an error if calling `add` and the collection does not have parent', (): void => {
    const formCollection = new FormCollection()

    expect.assertions(2)

    try {
      formCollection.add()
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
      expect(e.message).toEqual(expect.stringContaining(''))
    }
  })

  it('should remove a form by his index', (): void => {
    const formCollection = createFormCollection()

    formCollection.add()
    formCollection.add()

    const firstFormId = (formCollection.forms[0].$id = uniqueId())
    formCollection.forms[1].$id = uniqueId()

    expect(formCollection.forms.length).toBe(2)

    formCollection.remove(1)

    expect(formCollection.forms.length).toBe(1)
    expect(formCollection.forms[0].$id).toBe(firstFormId)
  })

  it('should remove a form by his id', (): void => {
    const formCollection = createFormCollection()

    formCollection.add()
    formCollection.add()

    const firstFormId = (formCollection.forms[0].$id = uniqueId())
    const secFormId = (formCollection.forms[1].$id = uniqueId())

    expect(formCollection.forms.length).toBe(2)

    formCollection.removeById(secFormId)

    expect(formCollection.forms.length).toBe(1)
    expect(formCollection.forms[0].$id).toBe(firstFormId)
  })

  it('should return all the forms in the collection', (): void => {
    const formCollection = createFormCollection()

    formCollection.add()
    formCollection.add()

    const forms = formCollection.all()

    expect.assertions(3)

    expect(forms.length).toBe(2)
    forms.forEach(
      (form): void => {
        expect(form).toBeInstanceOf(Form)
      }
    )
  })

  it('should remove all the forms from the array', (): void => {
    const formCollection = createFormCollection()

    formCollection.add()
    formCollection.add()

    formCollection.clear()

    expect(formCollection.forms.length).toBe(0)
  })

  it('should fill the forms with data', (): void => {
    const fillSpy = jest.spyOn(Form.prototype, '$fill')

    const mockValues = [{ name: '1' }, { name: '2' }, { name: '3' }]

    const formCollection = createFormCollection()

    formCollection.clear = jest.fn()

    formCollection.fill(mockValues)

    expect.assertions(6)

    expect(formCollection.clear).toHaveBeenCalledTimes(1)
    expect(formCollection.all().length).toBe(3)
    expect(formCollection.getInitialFormsIds()).toEqual([])
    formCollection.all().forEach(
      (form: Form, index): void => {
        expect(fillSpy).toHaveBeenNthCalledWith(
          index + 1,
          mockValues[index],
          false,
          true
        )
      }
    )

    mocked(fillSpy).mockClear()
  })

  it('should fill the form with data without calling the transformers', () => {
    const fillSpy = jest.spyOn(Form.prototype, '$fill')

    const mockValues = [{ name: '1' }]

    const formCollection = createFormCollection()

    formCollection.clear = jest.fn()

    formCollection.fill(mockValues, false, false)

    expect(fillSpy).toHaveBeenNthCalledWith(1, mockValues[0], false, false)

    mocked(fillSpy).mockClear()
  })

  it('should fill the forms with data and update the _initialFormsIds', (): void => {
    const fillSpy = jest.spyOn(Form.prototype, '$fill')
    const mockValues = [{ name: '1' }, { name: '2' }, { name: '3' }]

    const formCollection = createFormCollection()

    formCollection.fill(mockValues, true)

    expect.assertions(6)

    expect(formCollection.getInitialFormsIds().length).toBe(3)
    expect(formCollection.getInitialFormsIds()).toEqual(
      formCollection.all().map((form: Form): string => form.$id)
    )
    formCollection.all().forEach(
      (form: Form, index): void => {
        expect(fillSpy).toHaveBeenNthCalledWith(
          index + 1,
          mockValues[index],
          true,
          true
        )
      }
    )

    formCollection.fill([{ name: 123 }], true)

    expect(formCollection.getInitialFormsIds().length).toBe(1)

    mocked(fillSpy).mockClear()
  })

  it('should get all the forms values as array', (): void => {
    const valuesSpy = jest.spyOn(Form.prototype, '$values')
    const mockValues = [{ name: '1' }, { name: '2' }, { name: '3' }]

    const formCollection = createFormCollection()
    formCollection.fill(mockValues)

    const values = formCollection.values()

    expect.assertions(5)

    expect(values.length).toBe(3)
    expect(values).toEqual(mockValues)

    mockValues.forEach((value, index) => {
      expect(valuesSpy).toHaveBeenNthCalledWith(index + 1, true)
    })

    mocked(valuesSpy).mockClear()
  })

  it('should get all the forms values as array with out transformers', () => {
    const valuesSpy = jest.spyOn(Form.prototype, '$values')
    const mockValues = [{ name: '1' }]

    const formCollection = createFormCollection()
    formCollection.fill(mockValues)

    formCollection.values(false)

    expect(valuesSpy).toHaveBeenNthCalledWith(1, false)

    mocked(valuesSpy).mockClear()
  })

  it('should return that the form is not dirty', (): void => {
    const mockValues = [{ name: '1' }, { name: '2' }, { name: '3' }]

    const formCollection = createFormCollection()
    formCollection.fill(mockValues, true)

    expect(formCollection.isDirty()).toBe(false)
  })

  it('should return that the forms are dirty when adding or removing forms', (): void => {
    const mockValues = [{ name: '1' }, { name: '2' }, { name: '3' }]

    const formCollection = createFormCollection()
    formCollection.fill(mockValues, true)

    formCollection.add()

    expect(formCollection.isDirty()).toBe(true)

    formCollection.remove(0)

    expect(formCollection.isDirty()).toBe(true)
  })

  it('should return that the forms are dirty when field of one of the forms was changed ', (): void => {
    const mockValues = [{ name: '1' }, { name: '2' }, { name: '3' }]

    const formCollection = createFormCollection()
    formCollection.fill(mockValues, true)

    formCollection.forms[0].name = 'ABC'

    expect(formCollection.isDirty()).toBe(true)
  })

  it('should validate the forms inside the collection', async (): Promise<
    any
  > => {
    const mockValues = [{ name: '1' }, { name: '2' }, { name: '3' }]
    jest.spyOn(Form.prototype, '$validateForm')

    const formCollection = createFormCollection()
    formCollection.fill(mockValues)

    await formCollection.validate()

    expect.assertions(3)

    formCollection.all().forEach(
      (form: Form): void => {
        expect(form.$validateForm).toHaveBeenCalled()
      }
    )
  })
})
