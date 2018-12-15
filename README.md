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
```vue
<template>
  <form>
    <input type="text" v-model="form.email"/>
    <input type="text" v-model="form.name"/>
    <input type="text" v-model="form.password"/>
  </form>  
</template>

<script>
  export default {
    data() {
      return {
        form: new Form({
          email: null,
          name: null,
          password: null
        })
      }
    }
  }
</script>
```

**Submmiting the form**

The library wrapping up some form logic in `form.submit()` method, but the method is very flexible by the fact that it letting you choose the way to submit the form.

By default before any submission it validate the form (you will read about it bellow) and sett `form.$submitting` to true.
after submission complete, it set `form.$submitting` to false, and clear the form values (and more stuff that you will see below).

all the those default behivor can be changed by the `form.$options` object.

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- ... form inputs -->
    <buttom :disable="form.$submitting">
  </form>  
</template>

<script>
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
      handleSubmit() {
        this.submit((form) => axios.post('https://example.com/form', form.values())) // the callback function must return a promise
          .then(({reponse, form}) => // do what ever you want)
          .catch(({error, form}) => // handle errors)
      }
    }
  }
</script>
```

## :beers: Contribute
Evey body is welcome, you can contribute some Code, Docs, bug reports, ideas and even design. 

it is very easy to install the project just take a look at CONTRIBUTING.md and follow the instructions.

**The project is still on develop so ideas for features is more than welcome** ⭐

## :lock: License
The MIT License (MIT). Please see License File for more information.
