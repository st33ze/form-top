export default class Field {
  #container;
  #error;

  constructor({ input, label }) {
    this.#container = document.createElement('div');
    this.#container.className = 'form-field';

    this.#error = document.createElement('p');
    this.#error.className = 'form-error';
    this.#error.hidden = true;
    this.#error.ariaLive = 'polite';

    this.#container.append(label, input, this.#error);
  }

  get node() {
    return this.#container;
  }
}