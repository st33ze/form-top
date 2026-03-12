import CountrySelect from './CountrySelect.js';
import Input from './Input.js';
import PasswordInput from './PasswordInput.js';
import * as Validators from './Validators.js';

export default class Form {

  #form;
  #fields = {};

  constructor() {
    this.#form = document.createElement('form');
    this.#form.setAttribute('novalidate', '');

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
      attrs: { required: '', autocomplete: 'email', maxlength: '254' },
      validators: [Validators.required(), Validators.email()]
    });

    this.#fields.password = new PasswordInput({
      labelName: 'Password',
      validators: [
        Validators.required(),
        Validators.noEdgeSpaces(),
        Validators.minLength(8)
      ]
    });

    this.#fields.confirm = new PasswordInput({
      id: 'confirm-password',
      labelName: 'Confirm password',
      validators: [
        Validators.required(),
        Validators.noEdgeSpaces(),
        Validators.minLength(8),
        Validators.valueMatch(this.#fields.password.input, 'Passwords don\'t match')
      ]
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

    this.#fields.country = new CountrySelect({
      validators: [Validators.required()]
    });

    this.#fields.postal = new Input({
      type: 'text',
      id: 'postal',
      labelName: 'Postal code',
      attrs: { autocomplete: 'postal-code', maxlength: '15' }
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

  #attachValidators() {
    const {email, password, confirm, country} = this.#fields;

    [email, password, confirm].forEach(field => {
      field.input.addEventListener('blur', () => field.validate());
      field.input.addEventListener('input', () => {
        if (field.isInvalid()) field.validate();
      });
    });

    password.input.addEventListener('input', () => {
      if (!confirm.value) return;

      confirm.validate();
    });

    country.node.addEventListener('focusout', e => {
      if (!country.node.contains(e.relatedTarget)) country.validate();
    });
    country.input.addEventListener('change', () => {
      country.validate();
    });
  }

  get node() {
    return this.#form;
  }

}