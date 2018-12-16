# :pencil: Form wrapper JS
[![npm](https://img.shields.io/npm/v/form-wrapper-js.svg?style=shield)](https://www.npmjs.com/package/form-wrapper-js)
![](https://img.shields.io/github/license/Nevoss/form-wrapper-js.svg)
[![codecov](https://codecov.io/gh/Nevoss/form-wrapper-js/branch/master/graph/badge.svg)](https://codecov.io/gh/Nevoss/form-wrapper-js)
[![CircleCI](https://circleci.com/gh/Nevoss/form-wrapper-js.svg?style=shield)](https://circleci.com/gh/Nevoss/form-wrapper-js)

> Light weight library that create forms systems in a convenient and easy way, without dependencies and magic code.

## :art: Playgorund
- Vue - https://codesandbox.io/s/5x96q83yvp?module=%2Fsrc%2FApp.vue

## :cd: Installation
```
npm install --save form-wrapper-js
```
**or**
```
yarn add form-wrapper-js
```

## :rocket: Basic Usage

### Vue

**Binding the values**

```vue
<template>
  <form>
    <input type="text" v-model="form.email"/>
    <input type="text" v-model="form.name"/>
    <input type="text" v-model="form.password"/>
  </form>  
</template>

<script>
  import {Form} from 'form-wrapper-js'

  export default {
    data() {
      return {
        form: new Form({ // Setting up initial values
          email: null, 
          name: null,
          password: null
        })
      }
    }
  }
</script>
```

**Submitting the form**

The library wrapping up some form logic in `form.submit()` method, but the method is very flexible. it letting you chose the way you want to submit your form.

By default before any submission, it validates the form (you will read about it below) and set `form.$submitting` to true. after submission complete, it set `form.$submitting` to false and clear the form values (and more stuff that you will see below).

all those default behaviors can be changed by the `form.$options` object.

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- ... form inputs -->
    <buttom :disable="form.$submitting" />
  </form>  
</template>

<script>
  import {Form} from 'form-wrapper-js'
  import axios from 'axios'

  export default {
    data() {
      return {
        form: new Form({
          // ... form data
        })
      }
    },
    methods: {
      async handleSubmit() {
        try {
          const {response, form} = await this.submit(
            (form) => axios.post('https://example.com/form', form.values())
          ) // the callback function must return a promise
          
          // do what ever you want
          
        } catch ({ error, form }) {
          // handel errors
        }
      }
    }
  }
</script>
```

**Validating the form**

every value can get some validation rules, that by default will validate before submission, of course you can customize it and validate on input or on blur (see the ``form.$options` section).
```vue
<script>
  // ... imports (Form, axios, etc...)
  import { required, email } from '../rules'
  
  export default {
    data() {
      return {
        form: new Form({
          email: {
            value: null, // The initial value of "email"
            rules: [ required, email ],
            label: 'My great email' // set label to the field (not required)
          },
          name: null,
          password: { // The label will be by default "Password" (capitalize version of the field key)
            value: null,
            rules: [ required ]
          }
        })
      }
    }
  }
</script>
```
you can also validate the form throw the `form` api `form.validate()` will validate the whole form, and `form.validate('name')` will validate only the `name` field.

the `rules` file will look like this
```js
import validationLibrary from 'example-validation-library'

// Example for function like validation rule (will take default error message)
export const required = ({ value }) => value !== null || value !== ''

// Example for object like validation rule with message property (can be string or function)
export const email = {
  passes: ({ value }) => validationLibrary.isEmail(value), // use any thing you want to validate or just use regex 
  message: ({ label, value }) => `${label} must be an email, ${value} is not an email.`,
}
```

this behavior letting you create your validation file (or files) that can be reusable and also very light weight with out a lot of validation that you don't need.

**Handling with errors**

after you validating the form or validating specific field, and the validate was failed you can use the `form.$errors` api the get all those errors
```vue
<template>
  <form @submit.prevent="handleSubmit"> 
    <div>
      <input type="text" v-model="form.name">
      <span v-if="form.$errors.has('name')"> {{ form.$errors.getFirst('name') }} </span>
    </div>
    <!-- more form inputs -->
  </form>
</template>
``` 

`form.$errors.getFirst('fieldName')` will fetch the first error from the error array, but could be more then one error in specific field, `form.$errors.get(fieldName)` will fetch the whole errors array for this specific field.
 
 **Options**
 the library try to be as flexible ha it can so every step i guarded with an option, and there is some options that will let you customize the behavior of you forms.
 you can set options in 3 main ways
 ```js
import { Form } from 'form-wrapper-js'

// assign some options after the form instantiate
let form = new Form({ name: null })
form.assignOptions({
  validation: {
    onSubmission: false,
  }
})
// or 
form.$options.successfulSubmission.resetValues = true

// in the form construction
let form = new Form({ name: null }, {
  validation: {
    onFieldBlurred: false,
    onFieldChanged: true,
  }
})

// or setting some defaults that will apply to all the new instance of the form
Form.defaults.options.successfulSubmission.clearTouched = false
// or
Form.assignDefaultOptions({
  validation: {
    unsetFieldErrorsOnFieldChange: true,
    stopAfterFirstRuleFailed: true,
  }
})
```

by the way, all those options are totally valid options.

**Complex form handling**

Sometimes you need more from your form.
you need to know which of you input is on focus, which is dirty, which is touched, you want to handle the labels inside the form and you want to set some extra data to field that can be manageable with the form instance (e.g. select options and more..)
first to bind the form to the whole those feature
```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input
      v-model="form.name"
      @blur="form.fieldBlurred('name')" // when you need to know if field is touched or you validate on blur
      @focus="form.fieldFocused('name')" // when you need to know if field is on focus
      @input="form.fieldChanged('name')" // when you need to validate a field input/change
      type="text"
    >
  </form>
</template>
```

I recommending to us all those events hooks to get the whole experience, but you can combine those hooks with Form options and you can create a powerful form system that will behave exactly as you want.

as you build you own form system you can see that some pattern repeat them self, so you can even build a `Field` or a `Form` components that will encapsulate all those form logic (be creative as you want.)
you can do all those stuff just take a look the Form class API to see how to combine the Form options and Form API with you needs.

**Interceptors**

this concept is taking over from the axios API.
```js
import Form from 'form-wrapper-js'

let form = new Form({name: null})
form.$interceptors.submissionComplete(
  ({ form, response }) => {}, // this function will run every time submission SUCCESSFULLY completed
  ({ form, error }) => {} // this function will run every time submission was REJECTED!
)

form.$interceptors.beforeSubmission((form) => {}) // set some staff before submission
```

you can even set some default interceptors, that all the new instance of Form can use
```js
import Form from 'form-wrapper-js'

Form.default.interceptors.submissionComplete(null, ({ error, form }) => {
  if (error.response && error.response.status === 422) {
    // backend endpoint that return errors the form can "record" those error
    form.$errors.record(error.response.errors)
  }
  
  return Promise.reject({ error, form })
})
```

**Options**
those are the default options 
```js 
  {
    successfulSubmission: {
      clearErrors: true, // clear errors after successful submission
      clearTouched: true, // clear the touched array after successful submission
      resetValues: true, // set the values as the initial values that was provid at the construction after successful submission
    },
    validation: {
      onFieldBlurred: false, // validate on field bulrred
      onFieldChanged: false, // validate on field changed/input
      onSubmission: true, // validate on submission
      unsetFieldErrorsOnFieldChange: false, // on change/input the errors of the targetd field will removed
      stopAfterFirstRuleFailed: true, // if the first validation of spesific field will failed it will stop to validate this spesific field
      defaultMessage: ({ label }) => `${label} is invalid.`, // default meesage if error message not provided
    },
  }
```

---
**And please if something is not clear please dig inside the code to understand it better, I was trying to make a very clear code and comments, and if not please let me know**

---

## :beers: Contribute
Evey body is welcome, you can contribute some Code, Docs, bug reports, ideas and even design. 

it is very easy to install the project just take a look at CONTRIBUTING.md and follow the instructions.

**The project is still on develop so ideas for features is more than welcome** ⭐

## :lock: License
The MIT License (MIT). Please see License File for more information.
