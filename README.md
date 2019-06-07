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
  <a href="https://www.npmjs.com/package/form-wrapper-js" target="_blank">
      <img src="https://img.shields.io/npm/v/form-wrapper-js/next.svg?style=shield" alt="npm"/>
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

## Status: BETA

The current version is in beta, most of the feature are stable, but there are may still be bugs, and api may change a little bit.

for 0.x move to 0.x branch.

## :art: Playground

- Vue - [https://codesandbox.io/s/5x96q83yvp?module=%2Fsrc%2FApp.vue](https://codesandbox.io/s/5x96q83yvp?module=%2Fsrc%2FApp.vue)

## :cd: Installation

```
npm install --save form-wrapper-js@next  # for 1.x
// or
npm install --save form-wrapper-js  # for 0.x
```

**or**

```
yarn add form-wrapper-js@next  # for 1.x
// or
yarn add form-wrapper-js  # for 0.x
```

## :book: Documentation

Please check out the [Form Wrapper JS website](https://nevoss.github.io/form-wrapper-js).

## :rocket: Basic Usage

This is a quick example with **VUE**, please check out [the website](https://nevoss.github.io/form-wrapper-js) for full documentation.

```vue
<template>
  <form @submit.prevent="submit">
    <input type="text" v-model="form.email" />
    <input type="text" v-model="form.name" />
    <input type="text" v-model="form.password" />

    <button type="submit" :disabled="form.$submitting" />
  </form>
</template>

<script>
import { Form } from 'form-wrapper-js'
import axios from 'axios'

export default {
  data() {
    return {
      form: Form.create({
        email: null,
        name: null,
        password: null,
      }),
    }
  },
  methods: {
    async submit() {
      const { response } = await this.form.$submit(form =>
        axios.post('some-url', form.$values())
      )
    },
  },
}
</script>
```

## :beers: Contribute

**Code, Docs, Bug reports, Ideas - are more the welcome.** ⭐

the installation is very easy, take a look at CONTRIBUTING.md file and follow the instructions.

## :lock: License

The MIT License (MIT). Please see License File for more information.
