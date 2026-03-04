import CountrySelect from './CountrySelect.js';
import Input from './Input.js';
import PasswordInput from './PasswordInput.js';

export default class Form {
  #form;
  #fields = {};

  constructor() {
    this.#form = document.createElement('form');

    this.#form.append(
      this.#createHeader(),
      this.#createAuthSection(),
      this.#createLocalizationSection(),
      this.#createSubmitButton()
    );
  }

  #createHeader() {
    const container = document.createElement('header');

    const header = document.createElement('h1');
    header.textContent = 'charge into tomorrow';

    container.appendChild(header);
    return container;
  }

  #createAuthSection() {
    const container = document.createElement('div');
    container.classList.add('auth-section');

    this.#fields.email = new Input({
      type: 'email',
      labelName: 'Email',
      attrs: { 'required': '', 'autocomplete': 'email' }
    });

    this.#fields.password = new PasswordInput({ labelName: 'Password' });

    this.#fields.confirm = new PasswordInput({
      id: 'confirm-password',
      labelName: 'Confirm password'
    });

    container.append(
      this.#fields.email.node,
      this.#fields.password.node,
      this.#fields.confirm.node
    );

    return container;
  }

  #createLocalizationSection() {
    const container = document.createElement('div');
    container.classList.add('localization-section');

    this.#fields.country = new CountrySelect();

    this.#fields.postal = new Input({
      type: 'text',
      id: 'postal',
      labelName: 'Postal code',
      attrs: { autocomplete: 'postal-code' }
    });

    container.append(
      this.#fields.country.node,
      this.#fields.postal.node
    );

    return container;
  }

  #createSubmitButton() {
    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Submit';

    return button;
  }

  get node() {
    return this.#form;
  }
}