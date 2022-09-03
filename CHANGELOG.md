# Changelog for malle

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
