import COUNTRIES from './countries/countries.js';

class Input {
  static create({ type, id, labelName }) {
    const container = document.createElement('div');
    container.className = 'form-element';

    const input = document.createElement('input');
    input.type = type;
    input.id = id || type;
    input.placeholder = ' ';
    input.autocorrect = 'off';
    input.autocapitalize = 'none';
    input.spellcheck = 'false';

    const label = document.createElement('label');
    label.for = id;
    label.textContent = labelName || Input.capitalizeFirst(type);

    container.append(input, label);
    return container;
  }

  static capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

class Form {
  static create() {
    const form = document.createElement('form');

    form.append(
      Form.#createHeader(),
      Form.#createAuthSection(),
      Form.#createLocalizationSection(),
      Form.#createButton(),
    );

    Form.#addEventListeners(form);

    return form;
  }

  static #createHeader() {
    const container = document.createElement('header');

    const header = document.createElement('h1');
    header.textContent = 'charge into tomorrow';
    
    container.appendChild(header);
    return container;
  }

  static #createAuthSection() {
    const auth = document.createElement('div');
    auth.classList.add('auth-section');
    
    auth.append(
      Input.create({ type: 'email' }),
      Input.create({ type: 'password' }),
      Input.create({ type: 'password',
                     id: 'confirm-password',
                     labelName: 'Confirm Password'})
    );

    return auth;
  }

  static #fillCountryDropdown(dropdown) {
    for (const country of COUNTRIES) {
      const item = document.createElement('div');
      item.className = 'dropdown-item';
      item.setAttribute('role', 'option');
      item.setAttribute('tabindex', '-1');
      item.dataset.countryCode = country.code;

      const img = document.createElement('img');
      img.className = 'flag';
      img.src = `form/countries/flags/${country.code}.svg`;
      img.alt = `${country.name} flag`;

      const span = document.createElement('span');
      span.className = 'country-name';
      span.textContent = country.name;

      item.append(img, span);
      dropdown.appendChild(item);
    }
  }

  static #createLocalizationSection() {
    const localization = document.createElement('div');
    localization.classList.add('localization-section');

    localization.innerHTML = `
      <div class="form-element">
        <div class="country-select">
          <div id="country-input"
               class="country-input"
               contenteditable="true"
               role="combobox"
               aria-labelledby="country-label"
               aria-expanded="false"
               aria-autocomplete="list"
               aria-owns="country-dropdown"
               aria-haspopup="listbox"
               aria-controls="country-dropdown">
          </div>
          <div id="country-dropdown"
               class="dropdown hidden"
               role="listbox">
          </div>
          <input type="hidden" name="country_code" id="country-code">
        </div>
        <label id="country-label">Country</label>
      </div>
      <div class="form-element">
        <input type="text"
               id="postal" 
               placeholder=" " 
               autocomplete="postal-code" 
               autocorrect="off" 
               autocapitalize="none" 
               spellcheck="false"/>
        <label for="postal">Postal Code</label>
      </div>
    `;

    Form.#fillCountryDropdown(localization.querySelector('#country-dropdown'));

    return localization;
  }

  static #createButton() {
    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Submit';

    button.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('Form submitted');
    });

    return button;
  }

  static #addEventListeners(form) {
    const countryLabel = form.querySelector('#country-label');
    const countryInput = form.querySelector('#country-input');
    countryInput.addEventListener('focus', () => {
      countryLabel.classList.add('label-moved');
      countryInput.closest('.form-element').classList.add('select-active');
    });
    countryInput.addEventListener('blur', () => {
      if (!countryInput.textContent.trim())
        countryLabel.classList.remove('label-moved');
    });
  }
}

export default Form.create();