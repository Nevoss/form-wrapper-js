[form-wrapper-js](../README.md) > [Form](../classes/form.md)

# Class: Form

## Hierarchy

**Form**

## Index

### Constructors

* [constructor](form.md#constructor)

### Properties

* [$errors](form.md#_errors)
* [$extra](form.md#_extra)
* [$fieldsPrefix](form.md#_fieldsprefix)
* [$id](form.md#_id)
* [$initialValues](form.md#_initialvalues)
* [$interceptors](form.md#_interceptors)
* [$labels](form.md#_labels)
* [$onFocus](form.md#_onfocus)
* [$options](form.md#_options)
* [$rules](form.md#_rules)
* [$submitting](form.md#_submitting)
* [$touched](form.md#_touched)
* [$validating](form.md#_validating)

### Methods

* [$addField](form.md#_addfield)
* [$addFields](form.md#_addfields)
* [$assignOptions](form.md#_assignoptions)
* [$debouncedValidateField](form.md#_debouncedvalidatefield)
* [$fieldBlurred](form.md#_fieldblurred)
* [$fieldChanged](form.md#_fieldchanged)
* [$fieldFocused](form.md#_fieldfocused)
* [$fill](form.md#_fill)
* [$getField](form.md#_getfield)
* [$getFieldKeys](form.md#_getfieldkeys)
* [$hasField](form.md#_hasfield)
* [$isDirty](form.md#_isdirty)
* [$isFieldDirty](form.md#_isfielddirty)
* [$isFormDirty](form.md#_isformdirty)
* [$isValidating](form.md#_isvalidating)
* [$removeField](form.md#_removefield)
* [$removeFields](form.md#_removefields)
* [$reset](form.md#_reset)
* [$resetValues](form.md#_resetvalues)
* [$submit](form.md#_submit)
* [$validate](form.md#_validate)
* [$validateField](form.md#_validatefield)
* [$validateForm](form.md#_validateform)
* [$values](form.md#_values)
* [$valuesAsFormData](form.md#_valuesasformdata)
* [$valuesAsJson](form.md#_valuesasjson)
* [_getRequiredInterceptors](form.md#_getrequiredinterceptors)
* [assignDefaultOptions](form.md#assigndefaultoptions)
* [create](form.md#create)

### Object literals

* [defaults](form.md#defaults)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Form**(id: *`string`*, rules: *`Rules`*, errors: *`Errors`*, touched: *`Collection`<`string`>*, validating: *`Collection`<`string`>*, interceptors: *`object`*): [Form](form.md)

*Defined in [core/Form.ts:132](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L132)*

Form Constructor

**Parameters:**

**id: `string`**

**rules: `Rules`**

**errors: `Errors`**

**touched: `Collection`<`string`>**

**validating: `Collection`<`string`>**

**interceptors: `object`**

| Name | Type |
| ------ | ------ |
| beforeSubmission | `Interceptors` |
| submissionComplete | `Interceptors` |

**Returns:** [Form](form.md)

___

## Properties

<a id="_errors"></a>

###  $errors

**● $errors**: *`Errors`*

*Defined in [core/Form.ts:77](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L77)*

Errors class - holds all the fields errors

___
<a id="_extra"></a>

###  $extra

**● $extra**: *`object`*

*Defined in [core/Form.ts:117](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L117)*

Holds all the extra data of a field

#### Type declaration

[key: `string`]: `any`

___
<a id="_fieldsprefix"></a>

###  $fieldsPrefix

**● $fieldsPrefix**: *`string`* = ""

*Defined in [core/Form.ts:132](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L132)*

specific for FormCollection to fill the error with the prefix of the parent field

___
<a id="_id"></a>

###  $id

**● $id**: *`string`*

*Defined in [core/Form.ts:67](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L67)*

Unique ID for the Form instance. the main use case is in the FormCollection to set a unique ID for every Form there

___
<a id="_initialvalues"></a>

###  $initialValues

**● $initialValues**: *`object`*

*Defined in [core/Form.ts:107](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L107)*

The initiate values of the fields

#### Type declaration

[key: `string`]: `any`

___
<a id="_interceptors"></a>

###  $interceptors

**● $interceptors**: *`object`*

*Defined in [core/Form.ts:94](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L94)*

Object of interceptors: beforeSubmission: interceptors that will be handled before submission submissionComplete: interceptors that will be handled after submission

#### Type declaration

 beforeSubmission: `Interceptors`

 submissionComplete: `Interceptors`

___
<a id="_labels"></a>

###  $labels

**● $labels**: *`object`*

*Defined in [core/Form.ts:112](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L112)*

Holds all the labels of the fields

#### Type declaration

[key: `string`]: `string`

___
<a id="_onfocus"></a>

###  $onFocus

**● $onFocus**: *`string` \| `null`* =  null

*Defined in [core/Form.ts:122](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L122)*

hold the input that is on focus right now

___
<a id="_options"></a>

###  $options

**● $options**: *[Options](../interfaces/options.md)* =  Form.defaults.options

*Defined in [core/Form.ts:102](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L102)*

Options of the Form

___
<a id="_rules"></a>

###  $rules

**● $rules**: *`Rules`*

*Defined in [core/Form.ts:72](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L72)*

RulesManager - hold all the fields rules.

___
<a id="_submitting"></a>

###  $submitting

**● $submitting**: *`boolean`* = false

*Defined in [core/Form.ts:127](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L127)*

determine if the form is on submitting mode

___
<a id="_touched"></a>

###  $touched

**● $touched**: *`Collection`<`string`>*

*Defined in [core/Form.ts:82](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L82)*

holds all the fields that was touched

___
<a id="_validating"></a>

###  $validating

**● $validating**: *`Collection`<`string`>*

*Defined in [core/Form.ts:87](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L87)*

holds all the fields keys that are in validation right now

___

## Methods

<a id="_addfield"></a>

###  $addField

▸ **$addField**(fieldKey: *`string`*, value: *`any` \| `OptionalFieldDeclaration`*): `FormWithFields`

*Defined in [core/Form.ts:192](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L192)*

Add a field to the form

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| fieldKey | `string` |  \- |
| value | `any` \| `OptionalFieldDeclaration` |   |

**Returns:** `FormWithFields`

___
<a id="_addfields"></a>

###  $addFields

▸ **$addFields**(fields: *`FieldsDeclaration`*): `FormWithFields`

*Defined in [core/Form.ts:225](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L225)*

Add number of fields to the form

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| fields | `FieldsDeclaration` |   |

**Returns:** `FormWithFields`

___
<a id="_assignoptions"></a>

###  $assignOptions

▸ **$assignOptions**(options: *[OptionalOptions](../interfaces/optionaloptions.md)*): `FormWithFields`

*Defined in [core/Form.ts:170](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L170)*

assign options to the form also generate again the debouncedValidationField method in case the `debouncedValidateFieldTime` was changed

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| options | [OptionalOptions](../interfaces/optionaloptions.md) |   |

**Returns:** `FormWithFields`

___
<a id="_debouncedvalidatefield"></a>

###  $debouncedValidateField

▸ **$debouncedValidateField**(fieldKey: *`string`*): `void`

*Defined in [core/Form.ts:477](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L477)*

Debounced version $validateField method

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| fieldKey | `string` |   |

**Returns:** `void`

___
<a id="_fieldblurred"></a>

###  $fieldBlurred

▸ **$fieldBlurred**(fieldKey: *`string`*): `FormWithFields`

*Defined in [core/Form.ts:550](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L550)*

handle blur on field

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| fieldKey | `string` |   |

**Returns:** `FormWithFields`

___
<a id="_fieldchanged"></a>

###  $fieldChanged

▸ **$fieldChanged**(fieldKey: *`string`*): `FormWithFields`

*Defined in [core/Form.ts:520](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L520)*

handle change/input event

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| fieldKey | `string` |   |

**Returns:** `FormWithFields`

___
<a id="_fieldfocused"></a>

###  $fieldFocused

▸ **$fieldFocused**(fieldKey: *`string`*): `FormWithFields`

*Defined in [core/Form.ts:536](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L536)*

handle focus on field

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| fieldKey | `string` |   |

**Returns:** `FormWithFields`

___
<a id="_fill"></a>

###  $fill

▸ **$fill**(data: *`object`*, updateInitialValues?: *`boolean`*): `FormWithFields`

*Defined in [core/Form.ts:331](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L331)*

fill the Form values with new values. without remove another fields values. if `updateInitialValues` is sets to true the $initialValues of the form will be updated to the new values

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| data | `object` | - |  \- |
| `Default value` updateInitialValues | `boolean` | false |   |

**Returns:** `FormWithFields`

___
<a id="_getfield"></a>

###  $getField

▸ **$getField**(fieldKey: *`string`*): `Field`

*Defined in [core/Form.ts:265](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L265)*

get Field returns data about the field, mostly used for validation

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| fieldKey | `string` |   |

**Returns:** `Field`

___
<a id="_getfieldkeys"></a>

###  $getFieldKeys

▸ **$getFieldKeys**(): `string`[]

*Defined in [core/Form.ts:255](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L255)*

return all the field keys of the form

**Returns:** `string`[]

___
<a id="_hasfield"></a>

###  $hasField

▸ **$hasField**(fieldKey: *`string`*): `boolean`

*Defined in [core/Form.ts:182](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L182)*

checks if field key is exists in the form

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| fieldKey | `string` |   |

**Returns:** `boolean`

___
<a id="_isdirty"></a>

###  $isDirty

▸ **$isDirty**(fieldKey?: *`string` \| `null`*): `boolean`

*Defined in [core/Form.ts:401](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L401)*

if fieldKey is passed as argument it checks if the field is dirty if not it checks if the whole form is dirty

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` fieldKey | `string` \| `null` |  null |   |

**Returns:** `boolean`

___
<a id="_isfielddirty"></a>

###  $isFieldDirty

▸ **$isFieldDirty**(fieldKey: *`string`*): `boolean`

*Defined in [core/Form.ts:374](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L374)*

determine if field is dirty

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| fieldKey | `string` |   |

**Returns:** `boolean`

___
<a id="_isformdirty"></a>

###  $isFormDirty

▸ **$isFormDirty**(): `boolean`

*Defined in [core/Form.ts:389](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L389)*

determine if the form is dirty. if one of the fields is dirty thw whole form consider as dirty

**Returns:** `boolean`

___
<a id="_isvalidating"></a>

###  $isValidating

▸ **$isValidating**(fieldKey?: *`string` \| `null`*): `boolean`

*Defined in [core/Form.ts:506](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L506)*

returns if is validating the field or the whole form

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` fieldKey | `string` \| `null` |  null |   |

**Returns:** `boolean`

___
<a id="_removefield"></a>

###  $removeField

▸ **$removeField**(fieldKey: *`string`*): `FormWithFields`

*Defined in [core/Form.ts:240](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L240)*

Remove a field from the form

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| fieldKey | `string` |   |

**Returns:** `FormWithFields`

___
<a id="_removefields"></a>

###  $removeFields

▸ **$removeFields**(fieldKeys: *`string`[]*): `FormWithFields`

*Defined in [core/Form.ts:279](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L279)*

Remove number of fields

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| fieldKeys | `string`[] |   |

**Returns:** `FormWithFields`

___
<a id="_reset"></a>

###  $reset

▸ **$reset**(): `FormWithFields`

*Defined in [core/Form.ts:410](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L410)*

reset the form state (values, errors and touched)

**Returns:** `FormWithFields`

___
<a id="_resetvalues"></a>

###  $resetValues

▸ **$resetValues**(): `FormWithFields`

*Defined in [core/Form.ts:363](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L363)*

Set all the fields value same as the $initialValues fields value

**Returns:** `FormWithFields`

___
<a id="_submit"></a>

###  $submit

▸ **$submit**(callback: *`SubmitCallback`*): `Promise`<`any`>

*Defined in [core/Form.ts:568](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L568)*

submit the form. this method received a callback that must return a Promise.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| callback | `SubmitCallback` |   |

**Returns:** `Promise`<`any`>

___
<a id="_validate"></a>

###  $validate

▸ **$validate**(fieldKey?: *`string` \| `null`*): `Promise`<`any`>

*Defined in [core/Form.ts:497](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L497)*

validate specific key or the whole form.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` fieldKey | `string` \| `null` |  null |   |

**Returns:** `Promise`<`any`>

___
<a id="_validatefield"></a>

###  $validateField

▸ **$validateField**(fieldKey: *`string`*): `Promise`<`any`>

*Defined in [core/Form.ts:423](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L423)*

validate a specific field

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| fieldKey | `string` |   |

**Returns:** `Promise`<`any`>

___
<a id="_validateform"></a>

###  $validateForm

▸ **$validateForm**(): `Promise`<`any`>

*Defined in [core/Form.ts:482](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L482)*

validate all the fields of the form

**Returns:** `Promise`<`any`>

___
<a id="_values"></a>

###  $values

▸ **$values**(): `object`

*Defined in [core/Form.ts:292](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L292)*

return the values of the fields in the form

**Returns:** `object`

___
<a id="_valuesasformdata"></a>

###  $valuesAsFormData

▸ **$valuesAsFormData**(): `FormData`

*Defined in [core/Form.ts:311](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L311)*

Returns FormData object with the form values, this one is for the use of file upload ot something similar.

**Returns:** `FormData`

___
<a id="_valuesasjson"></a>

###  $valuesAsJson

▸ **$valuesAsJson**(): `string`

*Defined in [core/Form.ts:318](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L318)*

returns the form values as a json string.

**Returns:** `string`

___
<a id="_getrequiredinterceptors"></a>

### `<Private>` _getRequiredInterceptors

▸ **_getRequiredInterceptors**(callback: *`SubmitCallback`*): `Interceptor`[]

*Defined in [core/Form.ts:590](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L590)*

return the submit interceptors the submit itself, and 2 interceptors to normalize fulfilled and rejected

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| callback | `SubmitCallback` |   |

**Returns:** `Interceptor`[]

___
<a id="assigndefaultoptions"></a>

### `<Static>` assignDefaultOptions

▸ **assignDefaultOptions**(options: *[OptionalOptions](../interfaces/optionaloptions.md)*): `void`

*Defined in [core/Form.ts:58](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L58)*

Assign default options to the Form class in more convenient way then "Form.defaults.options.validation.something = something"

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| options | [OptionalOptions](../interfaces/optionaloptions.md) |   |

**Returns:** `void`

___
<a id="create"></a>

### `<Static>` create

▸ **create**(fields?: *`FieldsDeclaration`*, options?: *[OptionalOptions](../interfaces/optionaloptions.md)*): `FormWithFields`

*Defined in [core/Form.ts:45](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L45)*

trigger the FormFactory to create a Form object

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` fields | `FieldsDeclaration` |  {} |  \- |
| `Default value` options | [OptionalOptions](../interfaces/optionaloptions.md) |  {} |   |

**Returns:** `FormWithFields`

___

## Object literals

<a id="defaults"></a>

### `<Static>` defaults

**defaults**: *`object`*

*Defined in [core/Form.ts:31](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L31)*

holds all the defaults for the forms

<a id="defaults.options"></a>

####  options

**● options**: *[Options](../interfaces/options.md)* =  defaultOptions

*Defined in [core/Form.ts:32](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L32)*

___
<a id="defaults.interceptors"></a>

####  interceptors

**interceptors**: *`object`*

*Defined in [core/Form.ts:33](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L33)*

<a id="defaults.interceptors.beforesubmission-1"></a>

####  beforeSubmission

**● beforeSubmission**: *`Interceptors`* =  new Interceptors()

*Defined in [core/Form.ts:34](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L34)*

___
<a id="defaults.interceptors.submissioncomplete-1"></a>

####  submissionComplete

**● submissionComplete**: *`Interceptors`* =  new Interceptors()

*Defined in [core/Form.ts:35](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/core/Form.ts#L35)*

___

___

___

