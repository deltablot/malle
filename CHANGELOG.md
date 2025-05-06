# Changelog for malle

## 2.7.1

* Don't add `role="button"` to `button` elements

## 2.7.0

* Allow focus of malleable elements with keyboard
* Allow editing of malleable elements by pressing space or enter

## 2.6.2

* bug/minor: events: ignore blur event after keypress has been handled. fix #11
* upgrade devDependencies

## 2.6.1

* Upgrade devDependencies to address CVE-2024-4068. Note that this does not impact production code, given that this project has no direct dependencies.

## 2.6.0

* Add `onCancel` option to give a function to run when a Cancel action is triggered. fix #13

## 2.5.2

* Allow returning a `Promise<boolean>` with `onEdit`

## 2.5.1

* Fix the type of `input` from `fun` or `onEdit` to `HTMLInputElement|HTMLSelectElement`

## 2.5.0

* Create a new instance of Malle for each element (PR #8). This allows opening multiple inputs at the same time. fix #4

## 2.4.2

* Add `onEscape` option to set behavior of Escape keypress (fix #6)
* Previous releases 2.4.0 and 2.4.1 were incorrect in terms of tags/versions

## 2.3.0

* Add `returnedValueIsTrustedHtml` so the function used on original element is `innerHTML` instead of the safer `innerText`.

## 2.2.0

* Add `color`, `date`, `time` input types.

## 2.1.0

* Add `after` hook, triggered after replacement of element.

## 2.0.0

* The `fun` function now expects a `Promise<string>` as return value

## 1.0.1

* Switch eslint-plugin-node (unmaintained) to eslint-plugin-n

## 1.0.0

* Minor typings changes
* Add missing definitions file
* Upgrade dependencies

## 0.7.0

* Allow `selectOptions` to be a Promise
* Add options `selectOptionsValueKey` and `selectOptionsTextKey` to customize the keys to use for value/text in generated options
* Automatically select the correct option in a select input if original text is the same as option's text
* Allow `SelectOptions` to have different keys

## 0.6.1

* Fix lint issue

## 0.6.0

* Add `requireDiff` option (defaults to true) to avoid calling `fun` if input is same as previous value.

## 0.5.0

* Add `inputValue` option to specify the value of the input in case we want something else than the innerText of the element

## 0.4.0

* Add `datetime-local` input type
* Add testing with `jest`
* Add server docker image

## 0.3.0

* Add `placeholder` option

## 0.2.0

* Add `onEdit` option
* Prevent default behavior of form on submit
