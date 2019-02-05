# Validation

In some cases you will need to set up client side validation and handling an error messages. The library will
try to make those issues easy to handle.

## Basic validation

Each field can have some `rules`, a rule is a function or an object that describe which cases the input value is valid and which cases it is not.

```js
import { Form } from 'form-wrapper-js'
import { required, email } from '@/helpers/validation.js'

export default {
  form: new Form({
    email: {
      value: null,
      rules: [required, email],
    },
  }),
}
```

The field property `email` has 2 rules bind to it, those 2 rules are declared in another file called `validation.js`.

```js
// helpers/validation.js

import { isEmail } from 'some-example-library'

export const required = ({ value }) => value !== null && value !== ''

export const email = {
  passes: ({ value }) => isEmail(value),
  message: ({ label }) => `${label} must be an email.`,
}
```

there are the 2 option you can use declare a validation rule:

- the first is just a function that returns `true` or `false`
  the error message that will be collected by the [Errors collector](/guide/validation#errors) is the default error as declare in
  the [options](/guide/options)
- the second is an object that must at least have a `passes` property, that act's just like a function rule type. the second property is `message` (that can be also simple `string`) that returns an error message that will collect by the [Errors collector](/guide/validation#Errors) if `passes` function will return `false`.

::: tip
By default the validation runs on submission. you can tweak out the [options](/guide/options) call validation on field input or on field blurred, and also
you can call the validation manually:

- `form.validate()` - will run validation to the whole form
- `form.validate('name')` - will validate only `name` field

check out the [options](/guide/options) before you uses those methods.
:::

## Validation`s functions

`passes` and `message` function can be very flexible in fact you can create a very powerful validation file or files.
their are both invoke with the same arguments:

- first argument is field, which holds:

```js
const field = {
  key: 'email', // the field key
  label: 'Email', // the label of the field
  value: 'somthing@example.com', // the current value of the field
}
```

- seconed argument is the whole form object

Here is an example for complex validation rule:

```js
export const sameAs = sameAsField => {
  return {
    passes: ({ value, label, key }, form) => value === form[sameAsField],
    message: ({ value, label, key }, form) =>
      `'${label}' must be equal to '${form.$labels[sameAsField]}'`,
  }
}
```

And the vue part

```js
import { Form } from 'form-wrapper-js'
import { sameAs } from '@/helpers/validation.js'

export default {
  data() {
    return {
      form: new Form({
        password: null,
        password_again: {
          value: null,
          rules: [sameAs('password')],
        },
      }),
    }
  },
}
```

The function `sameAs` returns an object and that object is our validation object.

As you can see validation rules can be very powerful and you can customize it as you like.

## Promise base validation

Somtimes you use a validation library or a http service that's returning a `Promise` and not a `boolean`
you can use it as well by returning the `Promise` in the validation function

```js
// helpers/validation.js
import { RuleValidationError } from 'form-wrapper-js'
import axios from 'axios'

export const isValidEmail = {
  passes: ({ value }) =>
    axios
      .post('https://example.com/is-valid-email', { email: value })
      .catch(error => {
        if (error.response.status === 422) {
          return Promise.reject(new RuleValidationError())
        }
      }),
  message: 'Email is already taken',
}
```

As you can see `passes` function will return an `Promise` that was return by the axios library, if this promise resolved
the input will be valid, if the promise rejected we catch it and check if the status is `422` (you can do any thing you want) and then
we return a rejected promise with `RuleValidationError`

::: danger
One thing to understand, you must reject with **`RuleValidationError`**! otherwise the error will bubble up.
:::

## Errors

The errors collector will collect errors each time you validate a specific field or the whole form,
you can display them out with a use of the `$errors` property.

```vue
<template>
  <form>
    <div>
      <input type="text" v-model="form.email" />
      <span v-if="form.$errors.has('email')">
        {{ form.$errors.getFirst('email') }}
      </span>
    </div>
  </form>
</template>
```

each field can have multiple errors so thats why `form.$errors.get('email')` will return an array of errors (if there is only one it will be array of one error :smile:),
that's why we use `form.$errors.getFirst('email')` to get the first error from the array.

there is more helpers that you should use

```js
form.$errors.any() // retruns if there is any error in the form

form.$errors.has('name') // returns if there is errors in `name` field

form.$errors.clear() // will clear all the errors

form.$errors.unset('name') // will clear only `name` field errors

form.$errors.all() // will returns all the fields and on each field has an array of errors

form.$errors.record({
  name: ['some errors', 'another one'],
  last_name: ['and another one again'],
}) // will fill errors with the object given
```
