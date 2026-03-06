import CountrySelect from './CountrySelect.js';
import Input from './Input.js';
import PasswordInput from './PasswordInput.js';
import { requiredValidator, emailValidator } from './Validators.js';

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

    this.#attachValidators();
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
      attrs: { 'required': '', 'autocomplete': 'email' },
      validators: [requiredValidator(), emailValidator()]
    });

    this.#fields.password = new PasswordInput({
      labelName: 'Password',
      validators: [requiredValidator()]
    });

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

  #attachValidators() {
    const email = this.#fields.email;
    email.input.addEventListener('blur', () => email.validate());
    email.input.addEventListener('input', () => {
      if (email.isInvalid()) email.validate();
    });

    const password = this.#fields.password;
    password.input.addEventListener('blur', () => password.validate());
    password.input.addEventListener('input', () => {
      if (password.isInvalid()) password.validate();
    });
  }

}