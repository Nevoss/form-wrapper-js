# Form submission

## Usage

There are couple of things that can happen when submitting a form, but first, let see a basic submission implementation.

```vue
<template>
  <form @submit.prevent="submit">
    <!-- Form inputs... -->
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
        // Form fields...
      }),
    }
  },
  methods: {
    async submit() {
      try {
        const { response, form } = await this.form.submit(form =>
          axios.post('https://example.com/form', form.values())
        )
      } catch ({ error, form }) {}
    },
  },
}
</script>
```

In this code snippet we are using 'axios' but `submit` method accept any method that returns a `Promise`.

On successful submission the `submit` method resolves an object with 2 properties.

- `response` - holds the resolved data from your `submit` method.
- `form` - holds the whole form object 

On failure the `submit` method throws an exception with 2 properties object.

- `error` - holds the exception that was throw (or rejected) from the `submit` method promise.
- `form` - holds the whole form object.

## Why do I need `submit`?

It seems like `submit` method just uses the callback you provide and nothing more, but in fact `submit` is doing little bit more:

- `$submitting` property become `true` when the user is sending the `Form` and turn to `false` when the submission is finished.
- By default the form is validating itself before any submission and do not send the request if the validation failed. (can be changed via [options](/guide/options)).
- By default the form clears the `errors`, the field `values` and the `touched` array after submission. (can be changed via [options](/guide/options)).

 In the next section there is an explanation about [interceptors](/guide/interceptors), this is another reason you should 
 use the `submit` method.
