# Getting Started

Before we getting started it's necessary to understand that this guide is written in the context of [VueJS](https://vuejs.org/),
just because the library was written in the same context.
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

First we have been import the `Form` class from the library, then created a form property inside Vue data property. `name` and `last_name`
are our form fields that was initiated with `null` value.

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
You can initiate the form fields with any value you likes, e.g:

```js
return {
  name: 'Joe Doe',
  last_name: '',
}
```

:::

Then we have bound the field properties to their inputs. the library sets the field property as a first citizen property of the
`Form` object, so you can just `get` and `set` field value like that: `form.name` and `form.last_name`

```html
<!-- init the form -->
<input name="name" v-model="form.name" />
<input name="last_name" v-model="form.last_name" />
<!-- -->
```

we use `v-model` like a normal vue reactive property, there is no magic here.

At the end we created the `submit` method, to send out the form fields values

```js
import axios from 'axios'

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

The Form `submit` method accept a function as it first arguments, the function must return a promise. to explore about more information of
how you can use the `submit` method take a look at [Form submission](/guide/form-submission.md) section.

Last thing to do is to bind the `submit` method that we created to the form itself

```html
<form @submit.prevent="submit"><!-- form inputs and button --></form>
```

::: warning
Don't forget to prevent the default behavior of the form by setting `prevent` modifier
:::

## Why do I need it?

So maybe the "Getting started" use case is too simple, you don't need a whole library just for the above simple case. **but** as you go on with this
guide you will explore solutions that can solves simple and complex problems that will pop up almost every time you will code a form. 
the idea of the library is to make the forms development more easy and fun. :smile:
