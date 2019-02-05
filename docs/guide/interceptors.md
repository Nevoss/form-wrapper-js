# Interceptors

Before we started, this module inspired by [axios](https://github.com/axios), so big thanks to.

## What `interceptors` are?

`interceptors` are basicly methods that are injected into the submission, some of them comes before the submission and some of them comes after.
the library letting creates your custom `interceptors`, here is some basic example.

Let say your server side endpoint returns an errors on submission and you want to `fill` the `$error` property with those errors,
the simple solution is doing something like that:

```js
export default {
  methods: {
    async submit() {
      try {
        await this.form.submit(
          () => axios()
          // ...
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

after you creates more form you realize that you duplicate this behivor from form to form, that is why you should use interceptors.

```js
// /src/form/Form.js
import { Form } from 'form-wrapper-js'

Form.defaults.interceptors.submissionComplete.use(
  null,
  ({ error: { response }, form }) => {
    if (response && response.status && response.status === 422) {
      form.$errors.fill(response.errors)
    }
  }
)

// In you component
export default {
  methods: {
    async submit() {
      await this.form.submit(
        () => axios(
          // ...
        )
      )
  },
}
```

now you components are much cleaner.

## How to use it?

For now there are 2 types of interceptors: `beforeSubmission` and `submissionComplete`.

- `beforeSubmission` runs before the form submission like `validation` (default interceptor).
- `submissionComplete` runs after the submission is complete like the above example (server side errors)

To use interceptors you just call the `use` method, the first argument invokes if the everything goes OK e.g: the submission passes.
the secoend parameter invokes of something failed on the way e.g: submission failed.

Default interceptors will affect on every new instance

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

You can also use interceptors after the `Form` instaciation.

```js
const form = new Form({
  name: null,
})

form.$interceptors.submissionComplete.use(({ response }) => {
  console.log(response)
})
```
