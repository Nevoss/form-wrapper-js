# Form submission

## Usage

There is couple of things that hapends when your are submitting your form, but first let see a basic submission

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
        const response = await this.form.submit(form =>
          axios.post('https://example.com/form', form.values())
        )
      } catch (e) {}
    },
  },
}
</script>
```

In this section we are using axios but this is important to know that `submit` method accept any thing
that returns `Promise`, that is the one rule to know about submission.

`submit` method resolves an object if the submission was successful, one property is the `Form` itself with the key of `form`
the other property is `response` that holds the response from your callback.

If the submission is failed the `submit` method throw an exception with an object thats holds 2 parameters. the first again is the `form`
and the secoend one is `error` that holds the error that returns from your callback.

## Why do I need `submit`?

It seems like `submit` method just uses the callback you provide and nothing more, but in fact `submit` is doing little bit more:

- `$submitting` property become `true` when the user is sending the `Form` and turn to `false` when the submission is finished.
- By default the form is validating itself before any submission and do not send the request if the validation failed. (can be changed via [options](/guide/options)).
- By default the form clear the `errors`, the field `values` and the `touched` array after submission (can be changed via [options](/guide/options)).

Those three behiviors are methods that we called [interceptors](/guide/interceptors). you can create your own custom [interceptors](/guide/interceptors)
to make your development more easy and clean up your code little bit.
