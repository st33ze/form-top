import Field from "./Field.js";

export default class Input {
  #field;
  #input;
  #validators = [];

  constructor({ type, id, labelName, attrs, validators }) {
    const input = document.createElement('input');
    input.type = type;
    input.id = id || type;
    input.placeholder = ' ';
    input.autocorrect = 'off';
    input.autocapitalize = 'none';
    input.spellcheck = 'false';

    for (const [key, value] of Object.entries(attrs || {})) {
      input.setAttribute(key, value);
    }

    const label = document.createElement('label');
    label.htmlFor = input.id;
    label.textContent = labelName;

    this.#field = new Field({ input, label });
    this.#input = input;
    this.#validators = validators;
  }

  validate() {
    for (const validator of this.#validators) {
      const error = validator({ value: this.#input.value });

      if (error) {
        this.#field.error = error;
        this.#input.ariaInvalid = 'true';
        return false;
      }
    }

    this.#field.error = '';
    this.#input.ariaInvalid = null;
    return true;
  }

  get input() {
    return this.#input;
  }

  get node() {
    return this.#field.node; 
  }
}