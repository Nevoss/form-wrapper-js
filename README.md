<p align="center">
  <a href="https://nevoss.github.io/form-wrapper-js" target="_blank">
    <img src="https://nevoss.github.io/form-wrapper-js/logo.svg" alt="Form Wrapper JS" width="120"/>
  </a>
</p>
<h1 align="center">
  Form wrapper js
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/form-wrapper-js" target="_blank">
    <img src="https://img.shields.io/npm/v/form-wrapper-js.svg?style=shield" alt="npm"/>
  </a>
  <img src="https://img.shields.io/github/license/Nevoss/form-wrapper-js.svg" alt="MIT"/>
  <a href="(https://codecov.io/gh/Nevoss/form-wrapper-js" target="_blank">
    <img src="https://codecov.io/gh/Nevoss/form-wrapper-js/branch/master/graph/badge.svg" alt="codecov"/>
  </a>
  <a href="(https://circleci.com/gh/Nevoss/form-wrapper-js" target="_blank">
    <img src="https://circleci.com/gh/Nevoss/form-wrapper-js.svg?style=shield" alt="CircleCI"/>
  </a>
</p>

> A lightweight library that creates forms systems in a convenient and easy way, without dependencies and magic code.

## :art: Playground

- Vue - https://codesandbox.io/s/5x96q83yvp?module=%2Fsrc%2FApp.vue

## :cd: Installation

### Using `npm`
```
npm install --save form-wrapper-js
```

### Using `yarn`

```
yarn add form-wrapper-js
```

## :book: Documentation

Please check out the [Form Wrapper JS website](https://nevoss.github.io/form-wrapper-js).

## :rocket: Basic Usage

Here's a quick example.

For the full documentation, please check out [the website](https://nevoss.github.io/form-wrapper-js).

```vue
<template>
  <form @submit.prevent="submit">
    <input type="text" v-model="form.email" />
    <input type="text" v-model="form.name" />
    <input type="text" v-model="form.password" />

    <button type="submit" :disabled="form.$submitting">
  </form>
</template>

<script>
import { Form } from 'form-wrapper-js'
import axios from 'axios'

export default {
  data() {
    return {
      form: new Form({
        email: null,
        name: null,
        password: null,
      }),
    }
  },
  methods: {
    async submit() {
      const { response } = await this.form.submit(form => axios.post('https//api.example/', form.values()))
    }
  },
}
</script>
```

## :beers: Contribute

**Code, Docs, Bug reports, Ideas - are more the welcome.** ⭐

The installation is very easy, take a look at CONTRIBUTING.md file and follow the instructions.

## :lock: License

The MIT License (MIT). Please see License File for more information.
