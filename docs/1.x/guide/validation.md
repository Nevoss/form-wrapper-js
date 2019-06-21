# Validation

There is some cases you will want to add client side validation and showing error messages. The library will
trying to make those issues easy to handle.

## Basic validation

Each field can have some `rules`, a rule is a function or an object that describe which cases the field value is valid and which cases it is not.

```js
import { Form } from 'form-wrapper-js'
import { required, email } from '@/form/validation.js'

export default {
  form: Form.create({
    email: {
      value: null,
      rules: [required, email],
    },
  }),
}
```

The field `email` has 2 rules, those 2 rules are declared in another file called `validation.js`.

```js
// form/validation.js

import { isEmail } from 'some-example-library'

export const required = ({ value }) => value !== null && value !== ''

export const email = {
  passes: ({ value }) => isEmail(value),
  message: ({ label }) => `${label} must be an email.`,
}
```

there are the 2 "shapes" of validation rule:

- The first is just a function that returns a `boolean`.
  the error message that will be collect by the [Errors collector](#errors) is the default error message that has been declared in
  the [form options](/guide/options)
- The second is an object. the object must at least have a `passes` property
  that should be just like a function rule. the second property is `message` (that can be also a simple `string`),
  it should return an error message that will collect by the [Errors collector](/guide/validation#Errors) in case the field is not valid.

::: tip
By default the validation runs on submission. you can tweak out the [options](/guide/options) and make your validation runs on field input event or on field blurred event
and also you can call the validation manually:

- `form.$validate()` - will validate the whole form
- `form.$validate('name')` - will validate only `name` field

check out the [options](/guide/options) before starting to use those methods.
:::

## Validation`s functions

`passes` and `message` functions can be very flexible in fact you can create a very powerful validation file or files.
they are both invokes with the same arguments:

- first argument is field, which contains:

```js
const field = {
  key: 'email', // field key
  label: 'Email', // label of the field
  value: 'somthing@example.com', // current value of the field
}
```

- second argument is the whole form object

Here is a quick example for a complex validation rule:

```js
export const sameAs = sameAsField => {
  return {
    passes: ({ value, label, key }, form) => value === form[sameAsField],
    message: ({ value, label, key }, form) =>
      `'${label}' must be equal to '${form.$labels[sameAsField]}'`,
  }
}
```

And here is how you can use it in a Vue component.

```js
import { Form } from 'form-wrapper-js'
import { sameAs } from '@/helpers/validation.js'

export default {
  data() {
    return {
      form: Form.create({
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

Sometimes you will use a validation library or an http service that's returning a `Promise` and not a `boolean`
you can use it as well by returning the `Promise` in the validation function

```js
// form/validation.js
import { RuleValidationError } from 'form-wrapper-js'
import axios from 'axios'

export const isValidEmail = async ({ value }) => {
  try {
    await axios.post('https://example.com/is-valid-email', { email: value })
  } catch (e) {
    if (e.response.status === 422) {
      throw new RuleValidationError(e.response.data.message)
    }

    // if the error is not validation error it just handle it
    // as a regular exception
    throw e
  }
}
```

As you can see `passes` function will return an `Promise` from the `axios` library, if the promise will resolved
the field will be marked as valid, if the promise will rejected and the response status will be `422` (simple check to asset that the error is validation error and not another error),
the function will will throw `RuleValidationError`, the first argument of the constructor is the validation message

::: danger
One thing to understand, you must reject with **`RuleValidationError`**! otherwise the error will bubble up.
:::

You can use `form.$isValidating('email')` In case that your `Promise` base validating take some time, the function will
return `true` if the `Promise` base validation is still running and `false` if not.

## Dynamic validation

Dynamic validation is useful when there is a field validation that depend on another field, to solve this problem there is special library function, `applyRulesIf`.

```js
// In your vue file
import { Form, applyRulesIf } from 'form-wrapper-js'
import { required } from '@/form/validation.js'

export default {
  data() {
    return {
      form: new Form({
        is_developer: false,
        programing_languages: {
          value: [],
          rules: [
            // another rules can be here...
            applyRulesIf((field, form) => form.is_developer === true, [
              required,
            ]),
            // another rules can be here...
          ],
        },
      }),
    }
  },
  // ...Your vue stuff
}
```

As you can see `applyRulesIf` takes 2 arguments,

- The first argument is the condition, simple function that returns boolean
- The second argument is an array of rules

In case that the condition will return `true` the rules will be called in the validation process, in case that it will return false
the rules will be ignored.

## Errors

The errors collector will collect errors each time validating a specific field or the whole form,
you can display those errors out with the use of `$errors` property.

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

Each field have an array of errors, `form.$errors.get('email')` will return the whole array,
`form.$errors.getFirst('email')` will return the first error from that array.

Here is a quick snippet of some methods from the `$errors` property you could and should use
from time to time.

```js
form.$errors.any() // checks if there is any error in the form

form.$errors.has('name') // check if there is errors in the `name` field

form.$errors.clear() // will clear all the errors

form.$errors.unset('name') // will clear only `name` field errors

form.$errors.all() // will return all the fields with an array of errors for each of them.

form.$errors.fill({
  name: ['some errors', 'another one'],
  last_name: ['and another one again'],
}) // will fill fields errors
```
