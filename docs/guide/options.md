# Options

In some cases you can customize the behivor of the form. in this section we will cover the default options and
how you can changed them

## Setting options

There is Three main way to change the options

- Secoend parameter of the form

```js
const form = new Form(
  {
    name: null,
  },
  {
    // here will be your override options object
  }
)
```

- In run time:

```js
const form = new Form({ name: null })

form.assignOptions({
  // override options object
})

// OR

form.$options.validation.onFieldBlurred = true // change spesific option
```

- change to all new instances that will come later:

```js
import { Form } from 'form-wrapper-js'

Form.assignDefaultOptions({
  // override options object
})

Form.defaults.options.validation.onFieldChanged = true // change spesific option
```

## Default options

This decleration snippet was taken from the code itself.

```js
{
  successfulSubmission: {
    /**
     * Clear errors after successful submission
     */
    clearErrors: true,

    /**
     * Clear all the touched array after successful submission
     */
    clearTouched: true,

    /**
     * Set the values to $initialValues after successful submission
     */
    resetValues: true,
  },
  validation: {
    /**
     * validate the field on field changed
     */
    onFieldChanged: false,

    /**
     * the debounce time (on milliseconds) for `debounceValidateField` method.
     * `debounceValidateField` method will be called on `fieldChanged` method.
     * if `validation.onFieldChanged` option equals to true
     */
    debouncedValidateFieldTime: 0,

    /**
     * validate the field on field blurred
     */
    onFieldBlurred: false,

    /**
     * should or not should validate the form on submission
     */
    onSubmission: true,

    /**
     * on "fieldChanged" call, the errors of the field will be removed
     */
    unsetFieldErrorsOnFieldChange: false,

    /**
     * It will stop the chain of a field validation when one rule of the
     * validation chain will failed.
     */
    stopAfterFirstRuleFailed: true,

    /***
     * Default message for errors
     */
    defaultMessage: ({ label }) => `${label} is invalid.`,
  }
}
```

::: warning

- `validation.onFieldChange` - will work only if the [field event `fieldChange`](/guide/field-events.md) was bounded to the field
- `validation.onFieldBlurred` - will work only if the [field event `fieldBlurred`](/guide/field-events.md) was bounded to the field
  :::
