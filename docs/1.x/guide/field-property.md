# Field Property

The basic usage of the `Form` object as explained on [Getting started](/guide) section
is very good for simple cases.

```js
import { Form } from 'form-wrapper-js'

export default {
  data() {
    return {
      form: Form.create({
        name: null,
      }),
    }
  },
}
```

But there is cases that you will want to set up some configuration to the field, like: `label`, `rules` (validation rules) and `extra`.
for this purpose there is another way you can declare a form field.

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
          extra: {
            // any thing you like
          },
        },
      }),
    }
  },
}
```

`rules` has covered in another section: [validation](/guide/validation.md). in this section we will dig into the other
field properties.

## Value property

::: warning
`value` is the only field that is **require** when you declare a field as an object.
:::

The value property will hold the initial value of the field:

```js
Form.create({
  name: {
    value: null, // null is the initial property of `name`
  },
})

// same as

Form.create({
  name: null,
})
```

## Label property

The label property is the display name of you field. the label will be used in validation error messages. you can also use it in your code:

```js
const form = Form.create({
  name: {
    value: null,
    label: 'Your name',
  },
  last_name: null,
})

form.$labels.name // -> 'Your name'
form.$labels.last_name // -> 'Last name'
```

As you can see if label is not exists in the field, the library will generate a default one (uppercase the first word and every underscore
will become a space)

## Extra Property

"extra" property will be used to anything that related to the field, and can be useful later in the code, 
One good example for that is an `options` property. field `options` can be declared and used later in the template.

```vue
<template>
<form>
  <select v-model="form.job_title">
    <option 
      v-for="option in form.$extra.job_title.options" 
      :key="option.value"
      :value="option.value"
    > {{ options.label }} </option>
  </select>
</form>
</template>

<script >
import { Form } from 'form-wrapper-js'

export default {
  data() {
    return {
      form: Form.create({
        job_title: {
          value: null,
          extra: {
            options: [
              { value: 1, label: 'Developer' },
              { value: 2, label: 'Manager' },
            ],
          },
        },
      })     
    }
  }
}
</script>
```

It is important to understand that you can set any property you like in `extra`.

---

**As we say before `rules` property will be cover later on [validation](/guide/validation.md) section.**



## Adding and removing fields
When you need to add or remove fields dynamically from your form, there is 4 methods that can help you with that.

1. Add single field

```js 
import { Form } from 'form-wrapper-js' 

const form = Form.create({email: null})

form.$addField('first_name', null)

// Or

form.$addField('last_name', {
  value: null,
  label: 'Somthing',
})

form.$values() // -> { email: null, first_name: null, last_name: null }

```

2. Add a number of fields

```js
import { Form } from 'form-wrapper-js' 

const form = Form.create({ email: null })

form.$addFields({
  first_name: null,
  last_name: {
    value: null,
    label: 'The last name',
  }
})

form.$values() // -> { first_name: null, last_name: null, email: null }
```

3. Remove a field

```js
import { Form } from 'form-wrapper-js' 

const form = Form.create({ first_name: null, last_name: null })

form.$removeField('first_name');

form.$values() // -> { last_name: null }
```

4. Remove a number of fields:

```js
import { Form } from 'form-wrapper-js' 

const form = Form.create({ first_name: null, last_name: null, email: null })

form.$removeFields(['first_name', 'last_name'])

form.$values() // -> { email: null }
```
