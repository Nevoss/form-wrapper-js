# Field events

To get the full power of the library it is recommended to bind 3 event methods to your fields:
`$fieldChanged`, `$fieldBlurred` and `$fieldFocused`.
in this section we will cover why do you need those method and how to use them.

## Field Focused

`$fieldFocused` method is useful for 2 things:

- To track which field is on focus
- To track which field is touched

```vue
<template>
  <div>
    <input type="text" v-model="form.name" @focus="form.$fieldFocused('name')" />
    <span v-if="form.$onFocus === 'name'"> Name is on focus </span>
    <span v-if="form.$touched.has('name')"> Name is touched </span>
  </div>
</template>
```

As you can see every time `@focus` event is triggered on `name` field, `$fieldFocused` method will be invoked with `name` as its' argument.
then the of `$onFocus` will become `name` and the field also will be marked as touched.

::: warning
Make sure to read `$fieldBlurred` method explanation when you are using `$fieldFocused` method to track `$onFocus` property.
:::

## Field Blurred

`$fieldBlurred` method is useful for 2 things:

- It will release `$onFocus` -  if you will bind `$fieldFocused` event without bind `$fieldBlurred` event,
  the field will remain `$onFocus` until you will call `$fieldFocused` again.
- It will validate the field if declared in the [options](/guide/options)

```vue
<template>
  <div>
    <input type="text" v-model="form.name" @blur="form.$fieldBlurred('name')" />
  </div>
</template>
```

## Field Changed

`$fieldChange` is a general method for 2 possible events, 
for some elements `onChange` event will be suitable and for another `onInput`.

The method is useful for 2 things:

- It will unset error if declared in the [options](/guide/optios)
- It will validate the field if declared in the [options](/guide/options)

```vue
<template>
  <div>
    <input type="text" v-model="form.name" @input="form.$fieldChanged('name')" />
    <select v-model="form.type" @change="form.$fieldChanged('type')">
      <!-- options.... -->
    </select>
  </div>
</template>
```

## Dirty fields

One thing that is not actually event method but related to field event methods, are `dirty` fields.

A field is `dirty` if it has a different value from the initialized value.

```js
const form = new Form({
  name: 'Nevo',
  last_name: 'Golan'
})

form.name = 'Nevo +'

form.$isDirty('name') // returns true
form.$isDirty('last_name') // returns false

form.$isDirty() // returns true
```

When you pass an argument to the `$isDirty` method it checks the field key that you passed to it, but if you call the 
method without arguments it will check the whole form and then return `true` if at least one field is `dirty`.



## Summary

The main idea of these methods is to make it easy to track some meta data of the form. Which field is on focus? Which is touched? And to validate
the field in some situations.

As you can see, a lot of this section is related to the [options](/guide/options) section. 
It will let you configure the basic behavior of the form, and will clear out your components. Be as creative as you can
and group up the repeated code to create reusable components.
