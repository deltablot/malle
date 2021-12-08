# malle

Edit in place library with no dependencies and small footprint.

## Description

`malle` allows you to listen to a particular event (e.g. click, hover) on an element (e.g. p, span) and transform that element into an input that will be processed by a function.

The event can be: click or hover.

The element can be a `p`, `div`, `span`, ...

The created input can be a normal input or a textarea.

The user provided function will typically POST to an endpoint to get some JSON back.

## Installation

~~~bash
npm i malle
# or
yarn add malle
~~~

## Usage

See the [tests/](./tests) folder for a full example.

~~~javascript
import { Malle } from 'malle';

// this is the function that will be called once user has finished entering text (press Enter or click outside)
const myCustomFunction = (value, event) => {
  console.log(`New text: ${value}`);
  // add here your code for POSTing the new value
  // something along the line of:
  return fetch('/ajax', {
    method: 'POST',
    body: JSON.stringify({ 'updateThis': value }),
  });
};

// now create the malle
const malle = new Malle({
  fun: myCustomFunction,
});
// and listen for events
malle.listen();
~~~

### Options

When instanciating the `Malle` class, you need to give it an `Options` argument. The only required value is `fun` which is your custom function.

Available options:

| name        | type          | default value           | description                                                            | required |
|-------------|---------------|-------------------------|------------------------------------------------------------------------|----------|
| classes     | Array<string> | []                      | An array of classes that will be added to the input element.           | no       |
| debug       | Boolean       | false                   | Set to true for debug messages in console.                             | no       |
| event       | String        | click                   | The type of event to listen to.                                        | no       |
| fun         | Function      | A rejected Promise      | A function returning a Reponse object with JSON.                       | yes      |
| inputType   | String        | input                   | What kind of input to generate (input, textarea).                      | no       |
| listenNow   | Boolean       | false                   | Set to true to start listening upon instanciation of the class.        | no       |
| listenOn    | String        | [data-malleable="true"] | A javascript selector for finding elements to listen to.               | no       |
| responseKey | String        | value                   | When reading the JSON response, what key corresponds to the new value. | no       |

## Contributing

See [contributing documentation](./CONTRIBUTING.md).

## License

This software is open source and licensed under the [MIT License](./LICENSE).
