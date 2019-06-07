# Interceptors

Before we started, this module inspired by [axios](https://github.com/axios), so big thanks to [axios](https://github.com/axios) contributors.

## What `interceptors` are?

`$interceptors` are basically methods that are injected into the submission process, some of them comes before the submission and some of them comes after.
the library letting creates your custom `$interceptors`. here are some basic examples.

Let say your server side endpoint returns an errors on submission and you wants to `fill` the `$errors` property with those errors,
the simple solution is to doing something like that:

```js
import axios from 'axios' 

export default {
  methods: {
    async submit() {
      try {
        await this.form.$submit(
          () => axios(
            // ...
          )
        )
      } catch ({ error: { response } }) {
        if (response && response.status && response.status === 422) {
          this.form.$errors.fill(response.errors)
        }
      }
    },
  },
}
```

This behavior can be repeat from form to form, to prevent this duplication we can use `$interceptors`.

```js
// /form/Form.js
import { Form } from 'form-wrapper-js'

Form.defaults.interceptors.submissionComplete.use(
  null,
  ({ error: { response }, form }) => {
    if (response && response.status && response.status === 422) {
      form.$errors.fill(response.errors)
    }
  }
)

// In a Vue component
export default {
  methods: {
    async submit() {
      await this.form.$submit(
        () => axios(
          // ...
        )
      )
    },
  },
}
```

## How to use it?

For now there are 2 types of interceptors: `beforeSubmission` and `submissionComplete`.

- `beforeSubmission` runs before the form submission like `validation` (default interceptor).
- `submissionComplete` runs after the submission is complete like the above example (server side errors)

To use interceptors you will need to call the `use` method, the first function argument will be called if the everything goes OK e.g: the submission passes.
the second one will be called if something went wrong e.g: the submission fail.

You can set default interceptors that will affect on every new instance of `Form`.

```js
import { Form } from 'form-wrapper-js'

Form.defaults.interceptors.submissionComplete.use(({ response, form }) => {
  console.log('submission success! with response:', response);
}, ({ error, error }) => {
  console.log('submission failed! with error:', error);
})

Form.defaults.interceptors.beforeSubmission.use(form => {
  console.log('values of the form before submission', form.values());
})
```

You can also use interceptors after the `Form` instantiated.

```js
const form = new Form({
  name: null,
})

form.$interceptors.submissionComplete.use(({ response }) => {
  console.log(response)
})
```
