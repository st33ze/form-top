import icons from './icons.js';
import { createIconButton } from './utility.js';
import CountrySelect from './Select.js';
import Input from './Input.js';


class Form {

  static create() {
    const form = document.createElement('form');

    form.append(
      Form.#createHeader(),
      Form.#createAuthSection(),
      Form.#createLocalizationSection(),
      Form.#createSubmitBtn(),
    );

    return form;
  }

  static #createHeader() {
    const container = document.createElement('header');

    const header = document.createElement('h1');
    header.textContent = 'charge into tomorrow';
    
    container.appendChild(header);
    return container;
  }

  static #createPasswordField(id, labelName) {
    const field = Input.create({ type: 'password', id, labelName });
    
    const input = field.querySelector('input');
    input.classList.add('password-input');

    const button = createIconButton(icons.show, 'Show password');
    button.classList.add('password-toggle');

    button.addEventListener('click', () => {
      if (input.type === 'password') {
        input.type = 'text';
        button.setAttribute('aria-label', 'Hide password');
        button.innerHTML = icons.hide;
      } else {
        input.type = 'password';
        button.setAttribute('aria-label', 'Show password');
        button.innerHTML = icons.show;
      }
    });

    field.appendChild(button);
    return field;
  }

  static #createAuthSection() {
    const auth = document.createElement('div');
    auth.classList.add('auth-section');
    
    auth.append(
      Input.create({ type: 'email' }),
      Form.#createPasswordField(),
      Form.#createPasswordField('confirm-password', 'Confirm password')
    );

    return auth;
  }

  static #createLocalizationSection() {
    const localization = document.createElement('div');
    localization.classList.add('localization-section');

    const country = CountrySelect.create();

    const postal = Input.create({ type: 'text', id: 'postal', labelName: 'Postal Code' });
    postal.querySelector('input').autocomplete = 'postal-code';

    localization.append(country, postal);

    return localization;
  }

  static #createSubmitBtn() {
    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Submit';

    button.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('Form submitted');
    });

    return button;
  }

}


export default Form.create();