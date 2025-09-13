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
  #node
  #options
  #selected

  constructor() {
    this.#node = CountrySelect.#create();
    this.#options = CountrySelect.#createOptions();
    this.#fillDropdown();
    this.#addEventListeners();
  }

  static #create() {
    const container = document.createElement('div');
    container.className = 'form-element';

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

    return container;
  }
  
  static #createOptions() {
    return COUNTRIES.map(country => {
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

      return {...country, element: node};
    });
  }

  #fillDropdown() {
    const dropdown = this.#node.querySelector('#country-dropdown');
    this.#options.forEach(option => dropdown.appendChild(option.element));
  }
  
  #filter(term) {
    this.#options.forEach(option => {
      const includesTerm = option.name.toLowerCase().includes(term);
      option.element.style.display = includesTerm ? '' : 'none';
    });
  }

  #select(option) {
    const hiddenInput = this.#node.querySelector('#country-code');

    this.#selected?.setAttribute('aria-selected', 'false');
    hiddenInput.value = '';

    this.#selected = option === this.#selected ? null: option;
    if (this.#selected) {
      this.#selected.setAttribute('aria-selected', 'true');
      hiddenInput.value = option.dataset.countryCode;
    }
  }

  #toggleModal() {
    this.#node.classList.toggle('select-active');
    document.body.classList.toggle('modal-open');
  }

  #addEventListeners() {
    const label = this.#node.querySelector('#country-label');
    const input = this.#node.querySelector('#country-input');
    const dropdown = this.#node.querySelector('#country-dropdown');
    
    input.addEventListener('focus', () => {
      label.classList.add('label-moved');
      this.#toggleModal();
    });

    input.addEventListener('blur', () => {
      if (!input.textContent.trim())
        label.classList.remove('label-moved');
    });

    input.addEventListener('input', () => {
      const term = input.textContent.toLowerCase().trim();
      this.#filter(term);
    });

    dropdown.addEventListener('click', (e) => {
      const option = e.target.closest('.dropdown-item');
      if (option) {
        this.#select(option);
        this.#toggleModal();
      }
    });
  }

  get node() {
    return this.#node;
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

    localization.append(country.node, postal);

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