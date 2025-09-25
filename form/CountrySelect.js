import COUNTRIES from "./countries/countries.js";
import icons from "./icons.js";
import { createIconButton } from "./utility.js";


export default class CountrySelect {

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

    const closeBtn = createIconButton(icons.close, 'Close country selection');
    closeBtn.classList.add('close-modal-btn');

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

    container.append(closeBtn, label, selectContainer);

    return {
      container,
      refs: { input, dropdown, hiddenInput, label, closeBtn }
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

  #getSelectedElement() {
    return this.#options.get(this.#refs.hiddenInput.value)?.element;
  }

  #select(option) {
    const selectedOpt = this.#getSelectedElement();
    if (selectedOpt) {
      selectedOpt.setAttribute('aria-selected', 'false');
      this.#refs.hiddenInput.value = '';
    }

    if (option !== selectedOpt) {
      option.setAttribute('aria-selected', 'true');
      this.#refs.hiddenInput.value = option.dataset.countryCode;
    }
  }

  #clearInput() {
    this.#refs.input.innerHTML = '';
    this.#container.classList.remove('is-filled');
  }

  #scrollToSelected() {
    if (this.#hasOptionSelected()) {
      this.#getSelectedElement().scrollIntoView({ block: 'center' });
    } else {
      this.#refs.dropdown.scrollTop = 0;
    }
  }

  #openModal() {
    this.#container.classList.add('select-active');
    document.body.classList.add('modal-open');
    this.#clearInput();
    this.#filterOptions('');
    this.#scrollToSelected();
  }
  
  #fillInput() {
    this.#refs.input.innerText = '';
    const copy = this.#getSelectedElement().cloneNode(true);
    this.#refs.input.append(...copy.children);
    this.#container.classList.add('is-filled');
  }
  
  #hasOptionSelected() {
    return this.#options.has(this.#refs.hiddenInput.value);
  }
  
  #closeModal() {
    this.#container.classList.remove('select-active');
    document.body.classList.remove('modal-open');

    if (this.#hasOptionSelected()) this.#fillInput();
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

    this.#refs.closeBtn.addEventListener('click', () => this.#closeModal());
  }

  get element() {
    return this.#container;
  }

}