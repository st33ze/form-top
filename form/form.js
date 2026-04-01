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
    this.#attachSubmitHandler();
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
      attrs: { autocomplete: 'postal-code', maxlength: '12' },
      validators: [Validators.postal()]
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
    const {email, password, confirm, country, postal} = this.#fields;

    [email, password, confirm, postal].forEach(field => {
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

  #attachSubmitHandler() {
    this.#form.addEventListener('submit', e => {
      e.preventDefault();
      
      const isValid = this.#validateForm();
      if (!isValid) return;

      const raw = this.#getFormData();
      const payload = this.#formatData(raw);
      console.log(payload);

    });
  }

  #validateForm() {
    let firstInvalid = null; 

    for (const field of Object.values(this.#fields)) {
      const valid = field.validate();

      if (!valid && !firstInvalid) firstInvalid = field;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }

    return true;
  }

  #getFormData() {
    return {
      email: this.#fields.email.value,
      password: this.#fields.password.value,
      country: this.#fields.country.value,
      postal: this.#fields.postal.value
    }
  }

  #formatData(raw) {
    return {
      email: raw.email.trim().toLowerCase(),
      password: raw.password,
      country: raw.country,
      postal: raw.postal.trim().toUpperCase(),
      createdAt: new Date().toISOString()
    }
  }

  get node() {
    return this.#form;
  }

}