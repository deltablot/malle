# Documentation for malle

Note: you can use this library in a typescript or javascript project. When in typescript, import the interfaces to have strong typing everywhere.

~~~javascript
import { InputType, EventType, Action, SelectOptions, Options, Malle } from 'malle';
~~~

## Overview

Once malle is imported into your project, you'll want to create a `Malle` instance with some options. You can then call the `listen()` method to start listening on targeted elements.

By default it will listen for click events on `[data-malleable='true']` elements, and create a text input with no action buttons (submit, cancel).

### Options

When instanciating the `Malle` class, you need to give it an `Options` argument. The only required value is `fun` which is your custom function.

Available options:

#### before
`Function(original: HTMLElement, event: Event): boolean`
default: `undefined`

This function will be called before anything else is done, once the trigger event has been fired. If it returns something else than `true`, the edition will be canceled.

#### cancel
`string`
default: `''`

The text that will be displayed on the Cancel button. If omitted or empty string, no cancel button will be shown

#### cancelClasses
`Array<string>`
default: `[]`

An array of classes that will be applied to the Cancel button.

#### formClasses
`Array<string>`
default: `[]`

An array of classes that will be applied to the form element.

#### inputClasses
`Array<string>`
default: `[]`

An array of classes that will be applied to the input element (children of the form).

#### debug
`boolean`
default: `false`

Be verbose about what is happening in the console.

#### event
`EventType`:
* `EventType.Click` (`'click'`)
* `EventType.Mouseenter` (`'mouseenter'`)
* `EventType.Mouseover` (`'mouseover'`)

default: 'click'

What kind of event will trigger the edit mode. If you are in TypeScript, import the `EventType` enum and use it. In a Javascript project, simply use the corresponding string value.

#### inputType
`InputType`:
* `InputType.Email` (`'email'`)
* `InputType.Number` (`'number'`)
* `InputType.Select` (`'select'`)
* `InputType.Text` (`'text'`)
* `InputType.Textarea` (`'textarea'`)
* `InputType.Url` (`'url'`)

default: 'text'

What kind of input will be replacing the target element. If you are in TypeScript, import the `InputType` enum and use it. In a Javascript project, simply use the corresponding string value.

#### focus
`boolean`
default: `true`

Bring the input into focus.

#### fun (required)
`Function(value: string, original: HTMLElement, event: Event, input: HTMLInputElement): string`
default: `undefined`

This is your function doing the hard work. It must return the `value` as a string, and this will be the new value of the target element. Use the original element, the event or the input to achieve what you want. Typically, this function will make a POST or PUT request to update the value in the backend.

#### listenNow
boolean
default: `false`

Set to true to start listening on events upon `Malle` class instanciation. Otherwise you need to call the `listen()` method yourself.

#### listenOn
string
default: `[data-malleable='true']`

What elements are we listening on? Use any value that you would put in `document.querySelector()` (e.g: `.malleable`, `#some-element`, `span`).

#### onBlur
`Action`
* `Action.Submit` (`'submit'`)
* `Action.Cancel` (`'cancel'`)
* `Action.Ignore` (`'ignore'`)

default value: 'submit'

What to do when the user clicks outside the input? By default the form will be submitted (if valid), but you can decide to do nothing or cancel the edition.

#### onEdit
`Function(original: HTMLElement, event: Event, input: HTMLInputElement): any`
default: `undefined`

This function will be called once the input is there and user is ready to type. The return value is not checked.

#### selectOptions
`Array<SelectOptions>`

default: `[]`

If your `inputType` is a `select`, you might want it to have options. A `SelectOptions` object looks like this:

~~~typecript
interface SelectOptions {
  value: string;
  text: string;
  selected?: boolean;
}
~~~

#### submit
string
default: `''`

The text that will be displayed on the Submit button. If omitted or empty string, no submit button will be shown

#### submitClasses
`Array<string>`
default: `[]`

An array of classes that will be applied to the Submit button.

#### tooltip
string
default: `''`

Set the title of the elements we listen on. You could use something like `Click to edit!`. The text will be visible if the mouse is hovering the element.


