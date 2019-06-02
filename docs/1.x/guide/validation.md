# Validation

There is some cases you will want to add client side validation and showing error messages. The library will
trying to make those issues easy to handle.

## Basic validation

Each field can have some `rules`, a rule is a function or an object that describe which cases the field value is valid and which cases it is not.

```js
import { Form } from 'form-wrapper-js'
import { required, email } from '@/form/validation.js'

export default {
  form: new Form({
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

Sometimes you will use a validation library or an http service that's returning a `Promise` and not a `boolean`
you can use it as well by returning the `Promise` in the validation function

```js
// form/validation.js
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

As you can see `passes` function will return an `Promise` from the `axios` library, if the promise will resolved
the field will be marked as valid, if the promise will rejected and the response status will be `422` (you can do any thing you want), the function will 
return a rejected promise with `RuleValidationError`

::: danger
One thing to understand, you must reject with **`RuleValidationError`**! otherwise the error will bubble up.
:::

You can use `form.$isValidating('email')` In case that your `Promise` base validating take some time, the function will
return `true` if the `Promise` base validation is still running and `false` if not.

## Dynamic validation

Dynamic validation is useful when there is a field validation that depend on another field, to solve this problem there are 2 options.

1. **This is the recommended way**, create a function that wraps the validation rule (object or function) inside another validation rule:
```js
// This example demonstrates a case that a validation rule is an object and not a function

// In your validation file
export const userRuleIf = (conditionCallback, rule) => {
  return {
    passes: (field, form) => {
      if (!conditionCallback(field, form)) {
        return true
      }

      return rule.passes(field, form)
    },
    message: rule.message,
  }  
}

// In your vue file
import { Form } from 'form-wrapper-js'
import { required, useRuleIf } from '@/form/validation.js'

export default {
  data() {
    return {
      form: new Form({
        is_developer: false,
        programing_languages: {
          value: [],
          rules: [
            userRuleIf((field, form) => form.is_developer === true, required),
          ]
        }
      })
    }
  },
  // ...Your vue stuff
}
```

Of course, you can extend this function and make it more flexible, one way to do so is to support also function validation rules
and not only objects.

2. Another way is to rebuild the whole rules for the specific field, you can do so with the method `form.$rules.buildFieldRules('fieldName', [rule, rule])`. 
   this option is less performance because there is some process that the library does to build those rules into something that the library can use. 
   but sometimes there are cases that your rule depend on data that lives outside the scope of the Form.

```js
// In your vue file
import { Form } from 'form-wrapper-js'
import { required, useRuleIf } from '@/form/validation.js'

export default {
  data() {
    return {
      is_developer: false,
      form: new Form({
        programing_languages: {
          value: [],
          rules: []
        }
      })
    }
  },
  methods: {
    switchIsDeveloper(state) {
      this.is_developer = state
      
      this.form.$rules.buildFieldRules(
        'programing_languages', 
        state ? [required] : []
      )
    } 
  }
  // ...Your vue stuff
}
```

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

form.$errors.record({
  name: ['some errors', 'another one'],
  last_name: ['and another one again'],
}) // will fill fields errors
```
