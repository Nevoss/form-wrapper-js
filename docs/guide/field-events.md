# Fields` events

To get the full power of the library you will need to bind 3 events to your fields
`fieldChange`, `fieldBlurred` and `fieldFocused`, **BUT** in most cases you will not need all of them.
in this section we will cover why do you need those method.

## Field Focused

`fieldFocused` method is usefull for 2 things:

- you can track which field is on focus
- you can track whice field is touched

```vue
<template>
<div>
  <input type="text" v-model="form.name" @focus="form.fieldFocused('name')" />
  <span v-if="form.$onFocus === 'name'"> Name is on focus </span>
  <span v-if="form.isTouched('name')"> Name is touched </span>
</div>
</tamplate>
```

As you can see every time we foucs on the field we call `fieldFocused` with argument `name` (the field name), Now we can use it on the template or in our script,
and we see as well the usage.

::: warning
Make sure to read `fieldBlurred` method explanation if you are using `fieldFocused` to track `$onFocus` property
:::

## Field Blurred

`fieldBlurred` method is usefull for 2 things:

- It will release `$onFocus` - that's mean that if you set `fieldFocused` event without setting `fieldBlurred` event,
  the field will remain `$onFocus` until you will call `fieldFocused` agian
- It will validate the field if declared in the [options](/guide/options)

```vue
<template>
<div>
  <input type="text" v-model="form.name" @blur="form.fieldBlurred('name')" />
</div>
</tamplate>
```

## Field Changed

`fieldChange` is a general name for 2 events that this method can be bind to, `change` event and `input` event.

The method is usefull for 2 things:

- It will unset error if declared in the [options](/guide/optios)
- It will validate the field if declared in the [options](/guide/options)

```vue
<template>
<div>
  <input type="text" v-model="form.name" @input="form.fieldChanged('name')" />
  <select v-model="form.type" @change="form.fieldChanged('type')">
    <!-- options.... -->
  </select>
</div>
</tamplate>
```

## Sum

The main idea of those methods is to make it easy to track some meta data of the form. which is on focus? which is touchd? and to validate
the field in some situations.

As you can see alot of this section related to the [options](/guide/options) section, it will let you configure the basic behivihor you
wants from your forms, and will clear out you components.

One more thing to notice somtimes can be very easy to take alot of those methods and bind them togther in a components, try to be creative
to create your own forms components systems.
