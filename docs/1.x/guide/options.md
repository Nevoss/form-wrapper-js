# Options

Options are great way o customize the behavior of your forms. in this section we will cover the default options and
how you can changed them.

## Setting options

There is Three main way to change the default options.

- As a second parameter of the `Form` constructor.

```js
const form = Form.create(
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
const form = Form.create({ name: null })

form.$assignOptions({
  // override options object
})

// OR

form.$options.validation.onFieldBlurred = true // change specific option
```

- Change the defaults will affect the new instance that will create from the `Form` class:

```js
import { Form } from 'form-wrapper-js'

Form.assignDefaultOptions({
  // override default options object
})

Form.defaults.options.validation.onFieldChanged = true // change specific default option
```

## Default options

This deceleration snippet was taken from the code itself. you can overview the whole 
`$options` object and the default values of it.

```js
export default {
  
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

- `validation.onFieldChange` - will work only if the [field event `$fieldChange`](/guide/field-events.md) was bounded to the field element.
- `validation.onFieldBlurred` - will work only if the [field event `$fieldBlurred`](/guide/field-events.md) was bounded to the field element.
  :::
