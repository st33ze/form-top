import COUNTRIES from './countries/countries.js';

class Input {

  static create({ type, id, labelName }) {
    const container = document.createElement('div');
    container.className = 'form-field';

    const input = document.createElement('input');
    input.type = type;
    input.id = id || type;
    input.placeholder = ' ';
    input.autocorrect = 'off';
    input.autocapitalize = 'none';
    input.spellcheck = 'false';

    const label = document.createElement('label');
    label.htmlFor = input.id;
    label.textContent = labelName || Input.capitalizeFirst(type);

    container.append(input, label);
    return container;
  }

  static capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

}


class CountrySelect {

  #container
  #refs
  #options

  constructor() {
    const { container, refs} = CountrySelect.#create();
    this.#container = container;
    this.#refs = refs;
    this.#options = CountrySelect.#createOptionsMap();
    this.#fillDropdown();
    this.#addEventListeners();
  }

  static #create() {
    const container = document.createElement('div');
    container.className = 'form-field';

    const selectContainer = document.createElement('div');
    selectContainer.className = 'country-select';

    const input = document.createElement('div');
    input.id = 'country-input';
    input.className = 'country-input';
    input.contentEditable = 'true';
    input.role = 'combobox';
    input.setAttribute('aria-labelledby', 'country-label');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-owns', 'country-dropdown');
    input.setAttribute('aria-haspopup', 'listbox');
    input.setAttribute('aria-controls', 'country-dropdown');

    const dropdown = document.createElement('div');
    dropdown.id = 'country-dropdown';
    dropdown.className = 'dropdown';
    dropdown.role = 'listbox';

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'country_code';
    hiddenInput.id = 'country-code';

    selectContainer.append(input, dropdown, hiddenInput);

    const label = document.createElement('div');
    label.id = 'country-label';
    label.className = 'select-label';
    label.textContent = 'Country';

    container.append(selectContainer, label);

    return {
      container,
      refs: { input, dropdown, hiddenInput, label}
    };
  }

  static #createCountryElement(country) {
      const node = document.createElement('div');
      node.className = 'dropdown-item';
      node.setAttribute('role', 'option');
      node.setAttribute('aria-selected', 'false');
      node.setAttribute('tabindex', '-1');
      node.dataset.countryCode = country.code;

      const img = document.createElement('img');
      img.className = 'flag';
      img.src = `form/countries/flags/${country.code}.svg`;
      img.alt = `${country.name} flag`;

      const span = document.createElement('span');
      span.className = 'country-name';
      span.textContent = country.name;

      node.append(img, span);
      return node;
  }

  static #createOptionsMap() {
    const options = new Map();
    COUNTRIES.forEach(country => {
      const element = this.#createCountryElement(country);
      options.set(country.code, {...country, element});
    });
    return options;
  }

  #fillDropdown() {
    for (const option of this.#options.values()) {
      this.#refs.dropdown.appendChild(option.element);
    }
  }
  
  #filterOptions(query) {
    for (const option of this.#options.values()) {
      const includesQuery = option.name.toLowerCase().includes(query);
      option.element.style.display = includesQuery ? '': 'none';
    }
  }

  #getSelectedOption() {
    return this.#options.get(this.#refs.hiddenInput.value)?.element;
  }

  #select(option) {
    const selectedOpt = this.#getSelectedOption();
    if (selectedOpt) {
      selectedOpt.setAttribute('aria-selected', 'false');
      this.#refs.hiddenInput.value = '';
    }

    if (option !== selectedOpt) {
      option.setAttribute('aria-selected', 'true');
      this.#refs.hiddenInput.value = option.dataset.countryCode;
    }
  }

  #openModal() {
    this.#container.classList.add('select-active');
    document.body.classList.add('modal-open');
  }
  
  #closeModal() {
    this.#container.classList.remove('select-active');
    document.body.classList.remove('modal-open');
  }
  
  #addEventListeners() {
    const input = this.#refs.input;
    
    input.addEventListener('focus', () => {
      this.#openModal();
    });

    input.addEventListener('blur', () => {
      input.textContent = input.textContent.trim();
    });

    input.addEventListener('input', () => {
      const term = input.textContent.toLowerCase().trim();
      this.#filterOptions(term);
    });

    this.#refs.label.addEventListener('click', () => input.focus());

    this.#refs.dropdown.addEventListener('click', (e) => {
      const option = e.target.closest('.dropdown-item');
      if (option) {
        this.#select(option);
        this.#closeModal();
      }
    });
  }

  get element() {
    return this.#container;
  }

}


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

  static #createLocalizationSection() {
    const localization = document.createElement('div');
    localization.classList.add('localization-section');

    const country = new CountrySelect();
    const postal = Input.create({ type: 'text', id: 'postal', labelName: 'Postal Code' });
    postal.querySelector('input').autocomplete = 'postal-code';

    localization.append(country.element, postal);

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