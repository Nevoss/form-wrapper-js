# Form Wrapper JS
[![npm](https://img.shields.io/npm/v/form-wrapper-js.svg?style=shield)](https://www.npmjs.com/package/form-wrapper-js)
[![codecov](https://codecov.io/gh/Nevoss/form-wrapper-js/branch/master/graph/badge.svg)](https://codecov.io/gh/Nevoss/form-wrapper-js)
[![CircleCI](https://circleci.com/gh/Nevoss/form-wrapper-js.svg?style=shield)](https://circleci.com/gh/Nevoss/form-wrapper-js)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=shield)](https://github.com/prettier/prettier)


A very light tool to create forms systems in a convenient and easy way, without dependencies and magic code.

---
**this library is letting you as a developer, 😎 to create a powerful form systems by choosing how to build it (GUI, validation, submission etc.)**

---

## Installation
```
npm install --save form-wrapper-js
```
**or**
```
yarn add form-wrapper-js
```

## Documentation
coming soon..

## Basic Usage
Basic examples in vue for now (react is coming soon...)

### VueJS
you can play around with basic example [Here](https://codesandbox.io/s/5x96q83yvp?module=%2Fsrc%2FApp.vue)

or just take a look at this code:
```html
  <template>
    <form @submit.prevent="submit">
      <div>
        <label> {{ form.$labels.first_name }} </label>
        <input v-model="form.first_name" name="first_name" />
        <span v-if="form.$errors.has('first_name')" class="text-red"> {{ form.$errors.get('first_name') }} </span>
      </div>
      <div>
        <label> {{ form.$labels.last_name }} </label>
        <input v-model="form.last_name" name="last_name" />
        <span v-if="form.$errors.has('last_name')" class="text-red"> {{ form.$errors.get('last_name') }} </span>
      </div>
    </form>
  </template>

  <script>
    import axios from 'axios'
    import { Form } from 'from-wrapper-js'

    const required = {
      passes: ({ value }) => value
      message: ({ label }) => `${label} is required` 
    }

    const minChars = (number) => {
      return {
        passes: ({ value }) => value.length > number,
        message: ({ label }) => `${label} must have more than ${number} characters`
      }
    }

    export default {
      data() {
        form: new Form({
          first_name: {
            value: null,
            label: 'First Name'
            rules: [ required, minChars(2) ]
          },
          last_name: null, // Label will be "Last name" and there is no client side validation rules to check on submit
        })
      },
      methods: {
        submit() {
          this.form.submit(form => axios.post('https://example.com/form'), form.data())
            .then(() => console.log('success'))
            .catch(() => console.log('handle some errors from the server (there is hook for more standard way of handling errors from server)'))
        }
      }
    }
  </script>
```

## Contribute
Evey body is welcome, you can contribute some Code, Docs, bug reports, ideas and even design. 

it is very easy to install the project just take a look at CONTRIBUTING.md and follow the instructions.

**The project is still on develop so ideas for features is more than welcome** ⭐

## License
The MIT License (MIT). Please see License File for more information.
