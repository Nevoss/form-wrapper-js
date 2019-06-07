[form-wrapper-js](../README.md) > [FormCollection](../classes/formcollection.md)

# Class: FormCollection

## Hierarchy

**FormCollection**

## Index

### Constructors

* [constructor](formcollection.md#constructor)

### Properties

* [_initialFormsIds](formcollection.md#_initialformsids)
* [fieldKey](formcollection.md#fieldkey)
* [forms](formcollection.md#forms)
* [parent](formcollection.md#parent)
* [prototype](formcollection.md#prototype)
* [prototypeOptions](formcollection.md#prototypeoptions)

### Methods

* [add](formcollection.md#add)
* [all](formcollection.md#all)
* [clear](formcollection.md#clear)
* [fill](formcollection.md#fill)
* [getInitialFormsIds](formcollection.md#getinitialformsids)
* [isDirty](formcollection.md#isdirty)
* [remove](formcollection.md#remove)
* [removeById](formcollection.md#removebyid)
* [validate](formcollection.md#validate)
* [values](formcollection.md#values)
* [create](formcollection.md#create)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new FormCollection**(prototype?: *`FieldsDeclaration`*, prototypeOptions?: *[OptionalOptions](../interfaces/optionaloptions.md)*): [FormCollection](formcollection.md)

*Defined in [core/FormCollection.ts:52](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/FormCollection.ts#L52)*

Constructor

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` prototype | `FieldsDeclaration` |  {} |  \- |
| `Default value` prototypeOptions | [OptionalOptions](../interfaces/optionaloptions.md) |  {} |   |

**Returns:** [FormCollection](formcollection.md)

___

## Properties

<a id="_initialformsids"></a>

### `<Private>` _initialFormsIds

**● _initialFormsIds**: *`string`[]* =  []

*Defined in [core/FormCollection.ts:52](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/FormCollection.ts#L52)*

Holds the ids of the forms that was declared as initials forms. The main reason is to make a compare between the new forms and the initials forms and then see if the form collection is dirty or not (take a look at `isDirty` method)

___
<a id="fieldkey"></a>

###  fieldKey

**● fieldKey**: *`string`* = ""

*Defined in [core/FormCollection.ts:44](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/FormCollection.ts#L44)*

the field on the parent form that holds the collection

___
<a id="forms"></a>

###  forms

**● forms**: *`FormWithFields`[]* =  []

*Defined in [core/FormCollection.ts:34](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/FormCollection.ts#L34)*

The forms array - holds the current Forms

___
<a id="parent"></a>

###  parent

**● parent**: *[Form](form.md) \| `null`* =  null

*Defined in [core/FormCollection.ts:39](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/FormCollection.ts#L39)*

The Form that is the parent of the collection of forms

___
<a id="prototype"></a>

###  prototype

**● prototype**: *`FieldsDeclaration`*

*Defined in [core/FormCollection.ts:24](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/FormCollection.ts#L24)*

The prototype for a Form item

___
<a id="prototypeoptions"></a>

###  prototypeOptions

**● prototypeOptions**: *[OptionalOptions](../interfaces/optionaloptions.md)*

*Defined in [core/FormCollection.ts:29](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/FormCollection.ts#L29)*

The options for a Form item

___

## Methods

<a id="add"></a>

###  add

▸ **add**(): `FormWithFields`

*Defined in [core/FormCollection.ts:87](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/FormCollection.ts#L87)*

Add new form to the forms array

**Returns:** `FormWithFields`

___
<a id="all"></a>

###  all

▸ **all**(): `FormWithFields`[]

*Defined in [core/FormCollection.ts:71](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/FormCollection.ts#L71)*

Return the all the forms

**Returns:** `FormWithFields`[]

___
<a id="clear"></a>

###  clear

▸ **clear**(): [FormCollection](formcollection.md)

*Defined in [core/FormCollection.ts:78](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/FormCollection.ts#L78)*

Clear the forms array

**Returns:** [FormCollection](formcollection.md)

___
<a id="fill"></a>

###  fill

▸ **fill**(data: *`object`[]*, updateInitialValues?: *`boolean`*): [FormCollection](formcollection.md)

*Defined in [core/FormCollection.ts:151](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/FormCollection.ts#L151)*

Fill the form inside the collection. if the flag updateInitialValues is passes as true it will update the \_initialFormsIds to make a compare if `isDirty` called

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| data | `object`[] | - |  \- |
| `Default value` updateInitialValues | `boolean` | false |   |

**Returns:** [FormCollection](formcollection.md)

___
<a id="getinitialformsids"></a>

###  getInitialFormsIds

▸ **getInitialFormsIds**(): `string`[]

*Defined in [core/FormCollection.ts:190](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/FormCollection.ts#L190)*

Returns \_initialFormsIds

**Returns:** `string`[]

___
<a id="isdirty"></a>

###  isDirty

▸ **isDirty**(): `boolean`

*Defined in [core/FormCollection.ts:177](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/FormCollection.ts#L177)*

Checks id the FormCollection is dirty or not

**Returns:** `boolean`

___
<a id="remove"></a>

###  remove

▸ **remove**(index: *`number`*): [FormCollection](formcollection.md)

*Defined in [core/FormCollection.ts:112](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/FormCollection.ts#L112)*

Remove a form from the forms array by his index

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| index | `number` |   |

**Returns:** [FormCollection](formcollection.md)

___
<a id="removebyid"></a>

###  removeById

▸ **removeById**(id: *`string`*): [FormCollection](formcollection.md)

*Defined in [core/FormCollection.ts:125](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/FormCollection.ts#L125)*

Remove a form from the forms array by his id

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| id | `string` |   |

**Returns:** [FormCollection](formcollection.md)

___
<a id="validate"></a>

###  validate

▸ **validate**(): `Promise`<`any`>

*Defined in [core/FormCollection.ts:197](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/FormCollection.ts#L197)*

validate all the forms inside the collection

**Returns:** `Promise`<`any`>

___
<a id="values"></a>

###  values

▸ **values**(): `object`[]

*Defined in [core/FormCollection.ts:134](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/FormCollection.ts#L134)*

return all the values of the forms in array

**Returns:** `object`[]

___
<a id="create"></a>

### `<Static>` create

▸ **create**(prototype?: *`FieldsDeclaration`*, prototypeOptions?: *[OptionalOptions](../interfaces/optionaloptions.md)*): [FormCollection](formcollection.md)

*Defined in [core/FormCollection.ts:14](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/FormCollection.ts#L14)*

a shortcut to create FormCollection

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` prototype | `FieldsDeclaration` |  {} |  \- |
| `Default value` prototypeOptions | [OptionalOptions](../interfaces/optionaloptions.md) |  {} |   |

**Returns:** [FormCollection](formcollection.md)

___

