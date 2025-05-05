/*!
 * This file is part of the "malle" library
 * Copyright 2021, 2022 Nicolas CARPi @ Deltablot
 * License MIT
 * https://github.com/deltablot/malle
 */

// The `InputType` will set the `type` attribute of the generated input element.
export enum InputType {
  Color = 'color',
  Date = 'date',
  Datetime = 'datetime-local',
  Email = 'email',
  Number = 'number',
  Select = 'select',
  Text = 'text',
  Textarea = 'textarea',
  Time = 'time',
  Url = 'url',
}

// List of possible trigger events
export enum EventType {
  // A mouse click triggers the event (default)
  Click = 'click',
  // Trigger malle when the mouse starts hovering the element
  Mouseenter = 'mouseenter',
  // Trigger malle when the mouse stops hovering the element
  Mouseover = 'mouseover',
}

// List of possible action that can be defined at different moments
export enum Action {
  // Submit the form
  Submit = 'submit',
  // Cancel change and revert to initial element
  Cancel = 'cancel',
  // Do nothing
  Ignore = 'ignore',
}

// Structure for the select element options
export interface SelectOptions {
  // Value of the option.
  value?: string;
  // Displayed text of the option.
  text?: string;
  // Is this option selected?
  selected?: boolean;
}

// Configuration object for the Malle class.
export interface Options {
  // Function to execute after all the other events.
  after?(original: HTMLElement, event:Event, value: string): boolean;
  /**
   * This function will be called before anything else is done, once the trigger event has been fired.
   * If it returns something else than `true`, the edition will be canceled.
   */
  before?(original: HTMLElement, event:Event): boolean;
  // The text displayed on Cancel button.
  // @example Abort
  cancel?: string;
  // The classes added to Cancel button.
  // @example ['btn', 'btn-secondary']
  cancelClasses?: Array<string>;
  // Enabling debug mode will produce verbose output in the console.
  // @default false
  debug?: boolean;
  // This is where you define the type of event that will trigger malle.
  // @default EventType.Click
  event?: EventType;
  // Should the newly created input grab focus?
  // @default true
  focus?: boolean;
  // The classes added to the form element.
  // @example ['d-inline-flex']
  formClasses?: Array<string>;
  /**
   * This is the main and only mandatory option parameter. It is the user function that is called when the Submit action happens.
   * @example with a custom function
   * ```
   * // this is the user function that will process the new value
   * // typically this will POST to some endpoint and get some json back
   * // it receives the event
   * const myCustomFunction = (value, orig) => {
   *   console.log(`New text: ${value}`);
   *   // do something with that value, like POSTing it somewhere
   *   return new Promise(resolve => resolve(value));
   * };
   *
   * new Malle({
   *   fun: myCustomFunction,
   * }).listen();
   * ```
   */
  fun(value: string, original: HTMLElement, event:Event, input: HTMLInputElement|HTMLSelectElement): Promise<string>;
  // The classes added to the input element.
  // @example ['form-control']
  inputClasses?: Array<string>,
  // Define the type of the input element.
  // @default InputType.Text
  inputType?: InputType;
  // Start listening immediatly or not.
  // @default false
  listenNow?: boolean;
  // HTML selector to target malleable elements on the page.
  listenOn?: string;
  // What Action should be taken when focus of the input is lost.
  onBlur?: Action;
  /**
   * A function that runs when a Cancel action is performed. Must return `true` or the input is not reverted to the original element.
   * @example
   * ```javascript
   * onCancel: (original, event, input) => {
   *   console.log('a cancel action has been detected');
   *   return true;
   * },
   * ```
   */
  onCancel?(original: HTMLElement, event:Event, input: HTMLInputElement|HTMLSelectElement): boolean | Promise<boolean>;
  /**
   * This function runs right after the form is created. Its return value has no impact.
   * @example
   * ```javascript
   * onEdit: (original, event, input) => {
   *   console.log('this will run after the input is present on the page');
   *   return true;
   * },
   * ```
   */
  onEdit?(original: HTMLElement, event:Event, input: HTMLInputElement|HTMLSelectElement): boolean | Promise<boolean>;
  // What Action should be taken when the Enter key is pressed?
  // @default Action.Submit
  onEnter?: Action;
  // What Action should be taken when the Escape key is pressed?
  // @default Action.Cancel
  onEscape?: Action;
  // A text that is shown on empty input.
  placeholder?: string;
  // Do nothing if new value is the same as the old value.
  // @default true
  requireDiff?: boolean;
  // Use innerHTML instead of innerText (only use if the return value is trusted HTML).
  // @default false
  returnedValueIsTrustedHtml?: boolean;
  /*
   * An array of options for InputType.Select. Can also be a Promise and fetched asynchronously.
   * @example Directly give the options to use
   * ```javascript
   * selectOptions: [
   *   { value: '1', text: 'Rivoli' },
   *   { value: '2', text: 'Austerlitz' },
   *   { value: '3', text: 'Marengo', selected: true },
   * ],
   * ```
   * @example Fetch the options with an HTTP request or any other function
   * ```javascript
   * // Change the keys used to lookup value and text
   * selectOptionsValueKey: 'id',
   * selectOptionsTextKey: 'title',
   * // this promises to return an Array with objects that have the keys "id" and "title"
   * selectOptions: Something.getOptions(),
   * ```
   */
  selectOptions?: Array<SelectOptions> | Promise<Array<SelectOptions>>;
  // What is the name of the key to use to lookup the values in the selectOptions array?
  // @default value
  selectOptionsValueKey?: string;
  // What is the name of the key to use to lookup the option text in the selectOptions array?
  // @default text
  selectOptionsTextKey?: string;
  // The text on the Submit button.
  // @example Save changes
  submit?: string;
  /**
   * The classes added to the submit button.
   * @example With bootstrap classes
   * ```
   * submitClasses: ['btn', 'btn-primary', 'mt-2'],
   * ```
   */
  submitClasses?: Array<string>;
  // The text added on hover of the malleable element. Uses the `title` attribute.
  tooltip?: string;
  // Allow setting a different value than the current element content.
  inputValue?: string;
}

export class Malle {
  form: HTMLFormElement;
  opt: Options;
  original: HTMLElement;
  input: HTMLInputElement|HTMLSelectElement;
  innerFun: string;
  ignoreBlur: boolean;

  constructor(options: Options) {
    this.opt = this.normalizeOptions(options);
    this.debug(`Options: ${JSON.stringify(this.opt)}`);
    this.ignoreBlur = false;
    if (this.opt.listenNow) {
      this.listen();
    }
    // by default we use innerText to insert the return value, but if we know it's trusted html we get back, we allow using innerHTML instead
    // once setHTML() becomes more widespread, we'll use that instead
    this.innerFun = this.opt.returnedValueIsTrustedHtml ? 'innerHTML' : 'innerText';
  }

  // Assign defaults to options
  normalizeOptions(options: Options): Options {
    const defaultOptions = {
      after: undefined,
      before: undefined,
      cancel: '',
      cancelClasses: [],
      formClasses: [],
      inputClasses: [],
      debug: false,
      event: EventType.Click,
      focus: true,
      fun: () => new Error('No user function defined!'),
      inputType: InputType.Text,
      listenNow: false,
      listenOn: '[data-malleable="true"]',
      onBlur: Action.Submit,
      onCancel: undefined,
      onEdit: undefined,
      onEnter: Action.Submit,
      onEscape: Action.Cancel,
      placeholder: '',
      requireDiff: true,
      returnedValueIsTrustedHtml: false,
      selectOptions: [],
      selectOptionsValueKey: 'value',
      selectOptionsTextKey: 'text',
      submit: '',
      submitClasses: [],
      tooltip: '',
      inputValue: '',
    };
    return Object.assign(defaultOptions, options);
  }

  /**
   * Add a listener on all malleable elements
   */
  listen() {
    document.querySelectorAll(this.opt.listenOn)
      .forEach((el: HTMLElement) => {
        const opt = this.opt;
        opt.listenNow = false;
        const m = new Malle(opt);
        el.addEventListener(this.opt.event, m.process.bind(m));
        // make the mouse change to pointer on targeted elements
        el.style.cursor = 'pointer';
        // make it focusable by keyboard
        if (!el.hasAttribute('tabindex')) {
          el.setAttribute('tabindex', '0');
        }
        // announce it as a button to assistive tech
        if (!el.hasAttribute('role')) {
          el.setAttribute('role', 'button');
        }
        // keyboard activation for Enter & Space
        el.addEventListener('keydown', (event: KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            m.process(event);
            event.preventDefault();
          }
        });
        if (this.opt.tooltip) {
          el.title = this.opt.tooltip;
        }
      });
    this.debug(`malle now listening for ${this.opt.event} events on elements with selector: ${this.opt.listenOn}`);
    return this;
  }

  /**
   * Print a debug message if we are in debug mode
   */
  debug(msg: string): void {
    if (this.opt.debug) {
      console.debug(msg);
    }
  }

  /**
   * Process the submit event: call user function and replace the input div with original element
   */
  submit(event: Event): boolean {
    // don't let the browser do anything
    event.preventDefault();

    // trigger browser validity check
    // and abort if it's not valid
    if (!this.form.reportValidity()) {
      return false;
    }
    // compare user input and original value: possibly abort if they are the same
    if (this.opt.requireDiff) {
      const newValue = this.opt.inputType === InputType.Select
        ? (this.input as HTMLSelectElement).options[(this.input as HTMLSelectElement).selectedIndex].text
        : this.input.value;

      if (this.original.innerText === newValue) {
        this.debug('original value is same as new value, reverting without calling fun');
        this.form.replaceWith(this.original);
        return false;
      }
    }
    this.opt.fun.call(this, this.input.value, this.original, event, this.input).then((value: string) => {
      this.original[this.innerFun] = this.opt.inputType === InputType.Select ? (this.input as HTMLSelectElement).options[(this.input as HTMLSelectElement).selectedIndex].text : value;
      this.form.replaceWith(this.original);
      // execute the after hook
      if (typeof this.opt.after === 'function') {
        return this.opt.after(this.original, event, value);
      }
    });

    return true;
  }

  cancel(event: Event): boolean {
    event.preventDefault();
    this.debug(event.toString());
    // execute the before hook
    if (typeof this.opt.onCancel === 'function') {
      this.debug('running onCancel function');
      if (this.opt.onCancel(this.original, event, this.input) !== true) {
        return;
      }
    }
    this.debug('reverting to original element');
    this.form.replaceWith(this.original);
    return true;
  }

  handleBlur(event: Event) {
    if (this.ignoreBlur) {
      return;
    }
    // read behavior from options
    let blurAction: string = this.opt.onBlur;
    // and let element override it
    if (this.original.dataset.maBlur) {
      blurAction = this.original.dataset.maBlur;
    }
    if (blurAction === Action.Ignore) {
      return;
    }
    this[blurAction](event);
  }

  handleKeypress(event: KeyboardEvent): boolean {
    // reset this global flag
    this.ignoreBlur = false;
    // ignore it for textarea
    if (this.opt.inputType === InputType.Textarea) {
      return false;
    }
    if (event.key === 'Enter') {
      // read behavior from options
      let enterAction: string = this.opt.onEnter;
      // and let element override it
      if (this.original.dataset.maEnter) {
        enterAction = this.original.dataset.maEnter;
      }
      if (enterAction === Action.Ignore) {
        event.preventDefault();
        return;
      }
      this[enterAction](event);
      this.ignoreBlur = true;
      return;
    }

    if (event.key === 'Escape') {
      // read behavior from options
      let escAction: string = this.opt.onEscape;
      // and let element override it
      if (this.original.dataset.maEscape) {
        escAction = this.original.dataset.maEscape;
      }
      if (escAction === Action.Ignore) {
        event.preventDefault();
        return;
      }
      this.ignoreBlur = true;
      this[escAction](event);
    }
  }

  getInput(): HTMLInputElement {
    // create the input
    let inputElement = 'input';
    if (this.opt.inputType === InputType.Textarea) {
      inputElement = 'textarea';
    }
    if (this.opt.inputType === InputType.Select) {
      inputElement = 'select';
    }
    const input = document.createElement(inputElement) as HTMLInputElement;

    if (this.opt.inputType !== InputType.Textarea && this.opt.inputType !== InputType.Select) {
      input.type = this.opt.inputType;
    }

    // data-ma-type on original element will override any type option from options
    if (this.original.dataset.maType) {
      input.type = this.original.dataset.maType;
    }

    // add the classes for our input
    this.opt.inputClasses.forEach(cl => {
      input.classList.add(cl);
    });
    // the value of the input is the current text of the original element
    // but it can also be specified elsewhere
    let value: string;
    if (this.opt.inputValue) {
      value = this.opt.inputValue;
    }
    if (this.original.dataset.maInputValue) {
      value = this.original.dataset.maInputValue;
    }
    if (!value) {
      value = this.original.innerText;
    }
    input.value = value;

    // PLACEHOLDER
    if (this.opt.placeholder) {
      input.placeholder = this.opt.placeholder;
    }
    // data-ma-placeholder will override the option
    if (this.original.dataset.maPlaceholder) {
      input.placeholder = this.original.dataset.maPlaceholder;
    }

    // add options for a select
    if (this.opt.inputType === InputType.Select) {
      Promise.resolve(this.opt.selectOptions).then(o => {
        o.forEach(o => {
          const option = document.createElement('option');
          option.value = o[this.opt.selectOptionsValueKey];
          option[this.innerFun] = o[this.opt.selectOptionsTextKey];
          option.selected = (o.selected ?? false) || this.original[this.innerFun] === o[this.opt.selectOptionsTextKey];
          input.appendChild(option);
        });
      });
    }
    // listen on keypress for Enter/Escape keys. Note that Escape will only appear with keydown/keyup, not keypress event.
    // and we need to use keydown instead of keyup otherwise the default behavior is processed.
    input.addEventListener('keydown', this.handleKeypress.bind(this));
    // listen also on blur events
    // but only if there is no action buttons
    if (this.opt.submit === '' && this.opt.cancel === '') {
      input.addEventListener('blur', this.handleBlur.bind(this));
    }
    return input;
  }

  /**
   * Process the triggering event: replace target element with an input
   */
  process(event: Event) {
    this.debug('Event triggered:');
    this.debug(event.toString());

    const el = event.currentTarget as HTMLElement;
    // keep the original element around
    this.original = el;

    // execute the before hook
    if (typeof this.opt.before === 'function') {
      if (this.opt.before(this.original, event) !== true) {
        return;
      }
    }

    // replace malleable element with input
    const form = document.createElement('form');
    // add the classes for our form
    this.opt.formClasses.forEach(cl => {
      form.classList.add(cl);
    });
    const input = this.getInput();
    form.appendChild(input);

    // now the submit/cancel buttons
    [Action.Submit, Action.Cancel].forEach(action => {
      if (this.opt[action]) {
        const btn = document.createElement('button');
        btn.innerText = this.opt[action];
        // add classes to button
        const actionClasses = action + 'Classes';
        this.opt[actionClasses].forEach((cl: string) => {
          btn.classList.add(cl);
        });
        // execute action on click
        btn.addEventListener('click', this[action].bind(this));
        form.appendChild(btn);
      }
    });

    el.replaceWith(form);

    if (this.opt.focus) {
      input.focus();
    }

    this.input = input;
    this.form = form;

    // execute the onEdit hook
    if (typeof this.opt.onEdit === 'function') {
      this.opt.onEdit(this.original, event, this.input);
    }
  }
}
