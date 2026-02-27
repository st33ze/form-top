/**
 * @typedef {Object} InputConfig
 * @property {string} type - Input type (email, password, text, etc.)
 * @property {string} [id] - Element id
 * @property {string} [labelName] - Label text
 * @property {Object.<string, string>} [attrs] - Additional HTML attributes
 */

export default class Field {
  #container;
  #input;
  #error;

  /**
   * @param {InputConfig} config
   */
  constructor(config) {
    this.#container = document.createElement('div');
    this.#container.className = 'form-field';

    this.#input = document.createElement('input');
    this.#input.type = config.type;
    this.#input.id = config.id || config.type;
    this.#input.placeholder = ' ';
    this.#input.autocorrect = 'off';
    this.#input.autocapitalize = 'none';
    this.#input.spellcheck = 'false';

    for (const [key, value] of Object.entries(config.attrs) || {}) {
      this.#input.setAttribute(key, value);
    }

    const label = document.createElement('label');
    label.htmlFor = this.#input.id;
    label.textContent = config.labelName || Field.#capitalizeFirst(config.type);

    this.#error = document.createElement('p');
    this.#error.className = 'form-error';
    this.#error.hidden = true;
    this.#error.ariaLive = 'polite';

    this.#container.append(label, this.#input, this.#error);
  }

  static #capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}