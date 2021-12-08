/*!
 * This file is part of the "malle" library
 * Copyright 2021 Nicolas CARPi @ Deltablot
 * License MIT
 * https://github.com/deltablot/malle
 */

export enum InputType {
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
  value: string;
  text: string;
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
  selectOptions?: Array<SelectOptions>;
  submit?: string;
  submitClasses?: Array<string>;
  tooltip?: string;
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
      selectOptions: [],
      submit: '',
      submitClasses: [],
      tooltip: '',
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
    // trigger browser validity check
    // and abort if it's not valid
    if (!this.form.reportValidity()) {
      return false;
    }
    const value = this.opt.fun.call(this, this.input.value, this.original, event, this.input);
    this.original.innerText = this.opt.inputType === InputType.Select ? (this.input as HTMLSelectElement).options[(this.input as HTMLSelectElement).selectedIndex].text : value;
    this.form.replaceWith(this.original);
    return true;
  }

  cancel(event): void {
    this.debug(event);
    this.debug('reverting to original element');
    this.form.replaceWith(this.original);
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
    // allow pressing enter for a textarea
    if (event.key === 'Enter' && this.opt.inputType !== InputType.Textarea) {
      return this.submit(event);
    }
    return false;
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
    input.value = this.original.innerText;

    // add options for a select
    if (this.opt.inputType === InputType.Select) {
      this.opt.selectOptions.forEach(o => {
        const option = document.createElement('option');
        option.value = o.value;
        option.innerText = o.text;
        option.selected = o.selected ?? false;
        input.appendChild(option);
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
      this.opt.before(this.original, event);
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
  }
}
