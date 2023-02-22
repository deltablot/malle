# malle

<p align="center">
  <img src="https://i.imgur.com/nvWVtu2.png" />
</p>


Edit in place library with **no dependencies** and small footprint.

![validate](https://github.com/deltablot/malle/workflows/validate/badge.svg)
[![npm version](https://badge.fury.io/js/@deltablot%2Fmalle.svg)](https://badge.fury.io/js/@deltablot%2Fmalle)
[![GitHub license](https://img.shields.io/github/license/deltablot/malle.svg)](https://github.com/deltablot/malle/blob/master/LICENSE)

## Description

`malle` allows you to listen to a particular event (e.g. click, hover) on an element (e.g. p, span) and transform that element into an input that will be processed by a function.

The event can be: click or hover.

The element can be a `p`, `div`, `span`, ...

The created input can be a normal input or a textarea.

The user provided function will typically POST to an endpoint to get some JSON back.

## Installation

~~~bash
npm i @deltablot/malle
# or
yarn add @deltablot/malle
~~~

## Quickstart

This is a minimal example:

~~~javascript
import { Malle } from '@deltablot/malle';

// now create the malle
const malle = new Malle({
  // this is the function that will be called once user has finished entering text (press Enter or click outside)
  // it receives the new value, the original element, the event and the input element
  fun: (value, original, event, input) => {
    console.log(`New text: ${value}`);
    console.log(`Original element:`);
    console.log(original);
    // add here your code for POSTing the new value
    return myFunctionReturingAPromiseString();
  },
}).listen(); // directly start listening after object creation
~~~

In this example, when a user clicks on an element with `data-malleable='true'`, the function in the `fun` option will be called. The element will be replaced by a `form` containing the `input` and optionally action buttons (Submit, Cancel).

See the [Documentation](./DOCUMENTATION.md) for usage and available options.

See the [demo/](./demo) folder for a full example.

## Contributing

See [contributing documentation](./CONTRIBUTING.md).

## License

This software is open source and licensed under the [MIT License](./LICENSE).
