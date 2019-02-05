# Field Property

Until now we see a basic usage of the Form class:

```js
import { Form } from 'form-wrapper-js'

export default {
  data() {
    return {
      form: new Form({
        name: null,
      }),
    }
  },
}
```

but what if we need to setting up more configuration to the field itself like: `label`, `rules` (validation rules) and `extras`.
you can declare a form field also like that:

```js
import { Form } from 'form-wrapper-js'

export default {
  data() {
    return {
      form: new Form({
        name: {
          value: null,
          label: 'My super Name',
          rules: [
            // validation rules will be here
          ],
          extras: {
            // any thing you like
          },
        },
      }),
    }
  },
}
```

`rules` are cover in ower [validation](/guide/validation.md) section. but in this section we will dig in to undrstand all the other
properties of the field.

## Value property

::: warning
`value` is the only field that **required** when declare your field as an object.
:::
The value propery will hold the initial value of the field:

```js
new Form({
  name: {
    value: null, // null is the initial propery of `name`
  },
})

// same as

new Form({
  name: null,
})
```

## Label propery

The label propery is the display name of you field, the label will be used in validation error messages, also you can use it yourself:

```js
const form = new Form({
  name: {
    value: null,
    label: 'Your name',
  },
  last_name: null,
})

form.$labels.name // -> 'Your name'
form.$labels.last_name // -> 'Last name'
```

As you can see if you don`t specify a lable the library will generate a default one, it will uppercase the first word and every underscore
will become a space.

## Extras propery

"extras" propery will be used to any thing that related to the field that you will need to use later, maybe in validation or maybe event in your
Vue template, one good example for that is `options`, you can speciify a field options that can be used in the template.

```js
const form = new Form({
  job_title: {
    value: null,
    extras: {
      options: [
        { value: 1, label: 'Developer' },
        { value: 2, label: 'Manager' },
      ],
    },
  },
})

form.$extras.job_title.options // -> (The option array from before)
```

---

**As we say before `rules` property will be cover later in this guide on [validation](/guide/validation.md) section.**
