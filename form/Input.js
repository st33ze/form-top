import Field from "./Field.js";

export default class Input {
  #field;
  #input;

  constructor({ type, id, labelName, attrs }) {
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
  }

  get input() {
    return this.#input;
  }

  get node() {
    return this.#field.node; 
  }
}