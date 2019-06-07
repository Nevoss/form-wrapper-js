[form-wrapper-js](../README.md) > [ValidationOptions](../interfaces/validationoptions.md)

# Interface: ValidationOptions

options that related to validation

## Hierarchy

**ValidationOptions**

## Index

### Properties

* [debouncedValidateFieldTime](validationoptions.md#debouncedvalidatefieldtime)
* [defaultMessage](validationoptions.md#defaultmessage)
* [onFieldBlurred](validationoptions.md#onfieldblurred)
* [onFieldChanged](validationoptions.md#onfieldchanged)
* [onSubmission](validationoptions.md#onsubmission)
* [stopAfterFirstRuleFailed](validationoptions.md#stopafterfirstrulefailed)
* [unsetFieldErrorsOnFieldChange](validationoptions.md#unsetfielderrorsonfieldchange)

---

## Properties

<a id="debouncedvalidatefieldtime"></a>

###  debouncedValidateFieldTime

**● debouncedValidateFieldTime**: *`number`*

*Defined in [types/options.ts:47](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/types/options.ts#L47)*

the debounce time (on milliseconds) for `debounceValidateField` method. `debounceValidateField` method will be called on `fieldChanged` method. if `validation.onFieldChanged` option equals to true

___
<a id="defaultmessage"></a>

###  defaultMessage

**● defaultMessage**: *`RuleMessageFunction` \| `string`*

*Defined in [types/options.ts:63](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/types/options.ts#L63)*

Default message for errors

___
<a id="onfieldblurred"></a>

###  onFieldBlurred

**● onFieldBlurred**: *`boolean`*

*Defined in [types/options.ts:40](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/types/options.ts#L40)*

validate the field on field blurred

___
<a id="onfieldchanged"></a>

###  onFieldChanged

**● onFieldChanged**: *`boolean`*

*Defined in [types/options.ts:30](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/types/options.ts#L30)*

validate the field on field changed

___
<a id="onsubmission"></a>

###  onSubmission

**● onSubmission**: *`boolean`*

*Defined in [types/options.ts:35](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/types/options.ts#L35)*

should or not should validate the form on submission

___
<a id="stopafterfirstrulefailed"></a>

###  stopAfterFirstRuleFailed

**● stopAfterFirstRuleFailed**: *`boolean`*

*Defined in [types/options.ts:58](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/types/options.ts#L58)*

It will stop the chain of a field validation when one rule of the validation chain will failed.

___
<a id="unsetfielderrorsonfieldchange"></a>

###  unsetFieldErrorsOnFieldChange

**● unsetFieldErrorsOnFieldChange**: *`boolean`*

*Defined in [types/options.ts:52](https://github.com/Nevoss/form-wrapper-js/blob/eef06a6/src/types/options.ts#L52)*

on "fieldChanged" call, the errors of the field will be removed

___

