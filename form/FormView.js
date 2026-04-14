import CountrySelect from './CountrySelect.js';
import Input from './Input.js';
import PasswordInput from './PasswordInput.js';
import * as Validators from './Validators.js';

import { fakeRequest } from './api.js';

export default class FormView {

  #node;
  #fields = {};
  #submitBtn
  #onSuccess;

  constructor({ onSuccess }) {
    this.#node = document.createElement('form');
    this.#node.setAttribute('novalidate', '');

    this.#submitBtn = this.#createSubmitButton();

    this.#node.append(
      this.#createAuthSection(),
      this.#createLocalizationSection(),
      this.#submitBtn
    );

    this.#attachValidators();

    this.#node.addEventListener('submit', e => this.#handleSubmit(e));

    this.#onSuccess = onSuccess;
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

    const label = document.createElement('span');
    label.classList.add('button__label');
    label.textContent = 'Submit';

    button.append(label);
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

  async #handleSubmit(e) {
    e.preventDefault();

    if (!this.#isValid()) return;

    const raw = this.#getFormData();
    const payload = this.#formatData(raw);

    this.#setSubmitting(true);

    try {
      await fakeRequest(payload);
      this.#onSuccess?.();
    } finally {
      this.#setSubmitting(false);
    }
  }

  #isValid() {
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

  #setSubmitting(submitting) {
    this.#submitBtn.disabled = submitting;
    this.#submitBtn.classList.toggle('data-loading', submitting);
    this.#submitBtn.setAttribute('aria-busy', submitting);
  }
  
  get node() {
    return this.#node;
  }

}