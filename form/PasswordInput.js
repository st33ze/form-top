import icons from "./icons.js";
import Input from "./Input.js";
import { createIconButton } from "./utility.js";

export default class PasswordInput {

  #field;
  #button;

  constructor({ id, labelName, validators }) {
    this.#field = new Input({
      type: 'password',
      id,
      labelName,
      attrs: { required: '', autocomplete: 'new-password', maxlength: '64' },
      validators
    });

    this.#field.input.classList.add('password-input');

    this.#button = createIconButton(icons.show, 'Show password');
    this.#button.classList.add('password-toggle');

    this.#button.addEventListener('click', () => this.#toggle());

    this.#field.node.appendChild(this.#button);
  }

  #toggle() {
    const input = this.#field.input;
    const isPassword = input.type === 'password';

    input.type = isPassword ? 'text': 'password';
    this.#button.setAttribute('aria-label', isPassword ? 'Hide password': 'Show password');
    this.#button.innerHTML = isPassword ? icons.hide: icons.show;
  }

  validate() {
    return this.#field.validate();
  }

  isInvalid() {
    return this.#field.isInvalid();
  }

  get value() {
    return this.#field.value;
  }

  get input() {
    return this.#field.input;
  }

  get node() {
    return this.#field.node;
   }

}