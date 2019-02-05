# Getting Started

Before we getting started it's impotent to know that the guide is written in the context of [VueJS](https://vuejs.org/),
just because all this library written in the same context.
**BUT** you can use it in any any context you likes, even in vanilla JS.

## Installation

Yarn:

```bash
yarn add form-wrapper-js
```

Npm:

```bash
npm install --save form-wrapper-js
```

## Basic Usage

the below example written in a single file vue component and demonstrated a basic usage of the library.

```vue
<template>
  <form @submit.prevent="submit">
    <input type="text" name="name" v-model="form.name" />
    <input type="text" name="last_name" v-model="form.last_name" />

    <button type="submit" />
  </form>
</template>

<script>
import { Form } from 'form-wrapper-js'
import axios from 'axios'

export default {
  data() {
    return {
      form: new Form({
        name: null,
        last_name: null,
      }),
    }
  },
  methods: {
    async submit() {
      try {
        const {response} = await this.form.submit(form =>
          axios.post('https://example.com/form', form.values())
        )
      } catch (e) {}
    },
  },
}
</script>
```

This is the most basic usage you will need from a form.

First we import the `Form` class from the library then we created a form property in Vue data property. `name` and `last_name`
are our form\`s inputs, we initiate there values with `null` for each of them.

```js
import { Form } from 'form-wrapper-js'

export default {
  data() {
    return {
      form: new Form({
        name: null,
        last_name: null,
      }),
    }
  },
}
```

::: tip
We can initiate the form fields with any value we like, e.g:

```js
return {
  name: 'Joe Doe',
  last_name: '',
}
```

:::

Then we bind the inputs properties to their inputs. the library sets the inputs properties as a first citizen property of the
form so you can just get and set any input property like: `form.name` and `form.last_name`

```html
<!-- init the form -->
<input name="name" v-model="form.name" />
<input name="last_name" v-model="form.last_name" />
<!-- -->
```

we use `v-model` like we used to use before there is no magic here.

And in the end we set up the submit method

```js
export default {
  // Vue stuff....
  methods: {
    async submit() {
      try {
        const response = await this.form.submit(form =>
          axios.post('https://example.com/form', form.values())
        )
      } catch (e) {}
    },
  },
}
```

the Form `submit` method accept a function as it first arguments the function must returns a promise, more information
how you can use the submit method is in the section: [Form submission](/guide/form-submission.md)

last thing we do is to bind the `submit` method that we created to the form itself

```html
<form @submit.prevent="submit"><!-- form inputs and button --></form>
```

::: warning
Don't forget to prevent the default behavior of the form by setting `prevent` modifier
:::

## Why do I need this?

So maybe the "Getting started" use case is too simple, you don\`t need a whole library just for this simple case. **but** as you go on with this
guide you will see more solutions that can solve simple and complex problems that will pop up almost every time you code a form, the idea of the library is to make the development of the form more easy and fun. :smile:
