# :pencil: Form wrapper JS
> A lightweight library that creates forms systems in a convenient and easy way, without dependencies and magic code.

[![npm](https://img.shields.io/npm/v/form-wrapper-js.svg?style=shield)](https://www.npmjs.com/package/form-wrapper-js)
![MIT](https://img.shields.io/github/license/Nevoss/form-wrapper-js.svg)
[![codecov](https://codecov.io/gh/Nevoss/form-wrapper-js/branch/master/graph/badge.svg)](https://codecov.io/gh/Nevoss/form-wrapper-js)
[![CircleCI](https://circleci.com/gh/Nevoss/form-wrapper-js.svg?style=shield)](https://circleci.com/gh/Nevoss/form-wrapper-js)


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

basic usage is written in the context of Vue.js, this is my framework of choice, I hope to write helpful documentation to other frameworks soon. (will love to get some help with that. :smile:)

### Binding values

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

### Submitting the form

The library wrapping up some form logic in `form.submit()` method, so just pass a callback that returns a `Promise`

By default before any submission, it validates the form (as describe bellow) and set `form.$submitting` to true. after submission complete, it set `form.$submitting` to false and clear the form values, `$errors` and `$touched` array.

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
          // handle errors
        }
      }
    }
  }
</script>
```

### Validating the form

every value can get some validation rules that by default will be validated before submission, of course, you can customize it and validate on input or on blur events (again, more information below).

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
the `rules` file will look like this
```js
import validationLibrary from 'example-validation-library'

// Example for validation rule as a function (will take default error message)

export const required = ({ value }) => value !== null || value !== ''


// Example for validation rule as an object, alongside with message property ("message" can be also a string).

export const email = {
  passes: ({ value }) => validationLibrary.isEmail(value), // use any library you want to validate, or just use regex 
  message: ({ label, value }) => `${label} must be an email, ${value} is not an email.`,
}
```

this behavior letting you create your validation file (or files) that can be reusable and also very lightweight, without a lot of validation rules you don`t need.

### Handling with form errors

after validating form or a specific field, there is a case that some fields not pass some rules. you can use `form.$errors` API to retrieve those field errors.

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
 
 ### Options
 
the library tries to be as flexible has it can, so there are some options that letting you customize the behavior of your forms, you can set those options in 3 main ways
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

// setting defaults that will apply on new Form instances.
Form.defaults.options.successfulSubmission.clearTouched = false
// or
Form.assignDefaultOptions({
  validation: {
    unsetFieldErrorsOnFieldChange: true,
    stopAfterFirstRuleFailed: true,
  }
})
```

Those are the default options 
```js 
{
  successfulSubmission: {
    clearErrors: true, // clear errors after successful submission
    clearTouched: true, // clear $touched array after successful submission
    resetValues: true, // after successful submission, it set the values as the initial values that were provided at the construction after successful submission
  },
  validation: {
    onFieldBlurred: false, // validate on field blurred
    onFieldChanged: false, // validate on change or input event
    onSubmission: true, // validate on submission
    unsetFieldErrorsOnFieldChange: false, // on change/input event, the errors of the targeted field will be removed
    stopAfterFirstRuleFailed: true, // if the first validation of a specific field will fail it will stop to validate this specific field
    defaultMessage: ({ label }) => `${label} is invalid.`, // default message, if an error message was not provided.
  },
}
```

### More complex form handling

Sometimes you need more from your form, which input is on focus? which is dirty? or which is touched? you want to handle the labels inside the form and to set some extra data to a field that can be managed within the form instance. (e.g. select options and more...)

to be able to use those features you need to bind some events to the input DOM element.
```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input
      v-model="form.name"
      @blur="form.fieldBlurred('name')"
      @focus="form.fieldFocused('name')"
      @input="form.fieldChanged('name')"
      type="text"
    >
  </form>
</template>
```

There is not necessarily need to bind all those events to the input, try them out to know which of them you need and which not.

some options will not work if there is no event binding e.g.
- `form.$options.validation.onFieldBlurred` - must have `fieldBlurred` event
- `form.$options.validation.onFieldChange` - must have `fieldChanged` event (on input/change DOM events)
- `form.$onFocus` - will not work if `fieldFocus` event will not bond to the input DOM element.
- etc..,

if you are not sure which of them you need, just bind all of them. (nothing bad will happened)
 
as you build your own form system you will see that some pattern repeat them self, be creative as you can and encapsulate those pattern inside components.


### Interceptors

this concept is taking over from the axios API.
```js
import Form from 'form-wrapper-js'

let form = new Form({name: null})
form.$interceptors.submissionComplete.use(
  ({ form, response }) => {
    // this function will run every time submission SUCCESSFULLY completed.
    return { form, response }
  }, 
  ({ form, error }) => {
    // this function will run every REJECTED submission
    return Promise.reject({ form, error })
  } 
)

form.$interceptors.beforeSubmission.use((form) => {
  // set some stuff before submission
  return form
}) 
```

you can even set some default interceptors, that all the new Form instances will automatically use those interceptors
```js
import Form from 'form-wrapper-js'

Form.default.interceptors.submissionComplete.use(null, ({ error, form }) => {
  if (error.response && error.response.status === 422) {
    // backend endpoint that return errors the form can "record" those error
    form.$errors.record(error.response.errors)
  }
  
  return Promise.reject({ error, form })
})
```

### Extra

so there are some things that were no covered throw this "basic-usage" guide, soon I will write a good documentation that will cover all features.

here are some basic methods and props that can be useful:
```js
import  { Form } from 'form-wrapper-js'

let form = new Form({name: null})

form.isDirty('name') // returns if the field is dirty (the value of 'name' different from the initial value)
form.isDirty() // if only one of the fields is dirty will return `true`

form.$onFocus // which field is on focus at the current time

form.$touched.has('name') // if field is touched returns true.
form.$touched.any() // returns true if some field is touched.

form.fill({ name: 'some name' }) // will fill the values based on the object that provided
form.values() // returns an object with all the fields values

form.validate('name') // will validate only the name field
form.validate() // will validate the whole form

form.$labels.name // will return the label of the field (eg: "Name")

form.$errors.has('name') // checks if `name` field has errors
form.$errors.get('name') // gets errors array of `name` field
form.$errors.getFirst('name') // gets the first error from errors array of `name` field

```
---
**And please if something is not clear enough, try to dig inside the code to understand it better, I was trying to make a very clear code and clear comments, and if something not clear enough please let me know**

---

## :beers: Contribute
Everybody is welcome, you can contribute some Code, Docs, bug reports and even ideas. 

it is very easy to install the project just take a look at CONTRIBUTING.md and follow the instructions.

**The project is still on development, so ideas for features are then welcome** ⭐

## :lock: License
The MIT License (MIT). Please see License File for more information.
