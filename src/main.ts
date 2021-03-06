/*!
 * This file is part of the "malle" library
 * Copyright 2021, 2022 Nicolas CARPi @ Deltablot
 * License MIT
 * https://github.com/deltablot/malle
 */

export enum InputType {
  Datetime = 'datetime-local',
  Email = 'email',
  Number = 'number',
  Select = 'select',
  Text = 'text',
  Textarea = 'textarea',
  Url = 'url',
}

export enum EventType {
  Click = 'click',
  Mouseenter = 'mouseenter',
  Mouseover = 'mouseover',
}

export enum Action {
  Submit = 'submit',
  Cancel = 'cancel',
  Ignore = 'ignore',
}

export interface SelectOptions {
  value?: string;
  text?: string;
  selected?: boolean;
}

export interface Options {
  before?(original: HTMLElement, event:Event): boolean;
  cancel?: string;
  cancelClasses?: Array<string>;
  formClasses?: Array<string>;
  inputClasses?: Array<string>,
  debug?: boolean;
  event?: EventType;
  inputType?: InputType;
  focus?: boolean;
  fun(value: string, original: HTMLElement, event:Event, input: HTMLInputElement): string;
  listenNow?: boolean;
  listenOn?: string;
  onBlur?: Action;
  onEdit?(original: HTMLElement, event:Event, input: HTMLInputElement): boolean;
  onEnter?: Action;
  placeholder?: string;
  requireDiff?: boolean;
  selectOptions?: Array<SelectOptions> | Promise<Array<SelectOptions>>;
  selectOptionsValueKey?: string;
  selectOptionsTextKey?: string;
  submit?: string;
  submitClasses?: Array<string>;
  tooltip?: string;
  inputValue?: string;
}

export class Malle {
  form: HTMLFormElement;
  opt: Options;
  original: HTMLElement;
  input: HTMLInputElement|HTMLSelectElement;

  constructor(options: Options) {
    this.opt = this.normalizeOptions(options);
    this.debug(`Options: ${JSON.stringify(this.opt)}`);
    if (this.opt.listenNow) {
      this.listen();
    }
  }

  /**
   * Assign defaults to options
   */
  normalizeOptions(options: Options): Options {
    const defaultOptions = {
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
      // don't listen for events on instanciation unless requested
      listenNow: false,
      listenOn: '[data-malleable="true"]',
      onBlur: Action.Submit,
      onEdit: undefined,
      onEnter: Action.Submit,
      placeholder: '',
      requireDiff: true,
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
        el.addEventListener(this.opt.event, this.process.bind(this));
        // make the mouse change to pointer on targeted elements
        el.style.cursor = 'pointer';
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
  submit(event): boolean {
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
    const value = this.opt.fun.call(this, this.input.value, this.original, event, this.input);
    this.original.innerText = this.opt.inputType === InputType.Select ? (this.input as HTMLSelectElement).options[(this.input as HTMLSelectElement).selectedIndex].text : value;
    this.form.replaceWith(this.original);
    return true;
  }

  cancel(event): boolean {
    event.preventDefault();
    this.debug(event);
    this.debug('reverting to original element');
    this.form.replaceWith(this.original);
    return true;
  }

  handleBlur(event) {
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

  handleKeypress(event): boolean {
    // we only care about the Enter key
    // and ignore it for textarea
    if (event.key !== 'Enter' || this.opt.inputType === InputType.Textarea) {
      return false;
    }
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
    let value;
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
          option.innerText = o[this.opt.selectOptionsTextKey];
          option.selected = (o.selected ?? false) || this.original.innerText === o[this.opt.selectOptionsTextKey];
          input.appendChild(option);
        });
      });
    }
    // listen on keypress for Enter key
    input.addEventListener('keypress', this.handleKeypress.bind(this));
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
  process(event) {
    this.debug('Event triggered:');
    this.debug(event);

    const el = event.currentTarget;
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
        this.opt[actionClasses].forEach(cl => {
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
