import icons from "./icons.js";

export default class SuccessView {

  #node;

  constructor() {
    this.#node = document.createElement('div');
    this.#node.classList.add('form-success');
    this.#node.setAttribute('role', 'status');
    this.#node.setAttribute('aria-live', 'polite');
    this.#node.setAttribute('aria-atomic', 'true');

    const header = document.createElement('h2');
    header.textContent = 'Welcome to the future'

    const p = document.createElement('p');
    p.textContent = 'Form has been sent';

    const icon = document.createElement('span');
    icon.className = 'success__icon';
    icon.innerHTML = icons.success;
    icon.setAttribute('aria-hidden', 'true');

    this.#node.append(header, icon, p);
  }

  get node() {
    return this.#node;
  }
}