import COUNTRIES from "./countries/countries.js";
import icons from "./icons.js";
import Input from "./Input.js";
import { createIconButton } from "./utility.js";


export default class CountrySelect {

  #container
  #refs
  #options
  #selectedValue

  constructor() {
    const { container, refs } = CountrySelect.#create();
    this.#container = container;
    this.#refs = refs;
    this.#options = CountrySelect.#createOptionsMap();
    
    CountrySelect.#fillDropdown(this.#refs.dropdown, this.#options.values());
    
    this.#addEventListeners();
  }

  static #create() {
    const container = Input.create({
      type: 'text',
      id: 'country-input',
      labelName: 'Country'
    });

    const closeBtn = createIconButton(icons.close, 'Close country selection');
    closeBtn.classList.add('close-modal-btn');

    const label = container.querySelector('label');
    label.id = 'country-label';

    const selectedDisplay = document.createElement('button');
    selectedDisplay.className = 'selected-display';
    selectedDisplay.type = 'button';
    selectedDisplay.setAttribute('aria-haspopup', 'listbox');
    selectedDisplay.setAttribute('aria-expanded', 'false');
    selectedDisplay.setAttribute('aria-labelledby', label.id);
    

    const input = container.querySelector('input');
    input.className = 'country-input';
    input.role = 'combobox';
    input.setAttribute('autocomplete', 'new-password');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-controls', 'country-dropdown');

    const dropdown = document.createElement('div');
    dropdown.id = 'country-dropdown';
    dropdown.className = 'dropdown';
    dropdown.role = 'listbox';

    container.prepend(closeBtn, selectedDisplay);
    container.appendChild(dropdown);

    return {
      container,
      refs: {closeBtn, selectedDisplay, input, dropdown}
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
      const element = CountrySelect.#createCountryElement(country);
      options.set(country.code, { ...country, element });
    });
    return options;
  }

  static #fillDropdown(dropdown, options) {
    for (const option of options) {
      dropdown.appendChild(option.element);
    }
  }
  
  static #filterOptions(query, options) {
    for (const option of options) {
      const includesQuery = option.name.toLowerCase().includes(query);
      option.element.style.display = includesQuery ? '' : 'none';
    }
  }

  #getSelectedElement() {
    return this.#options.get(this.#selectedValue)?.element;
  }

  #updateSelectedDisplay() {
    const copy = this.#getSelectedElement().cloneNode(true);
    this.#refs.selectedDisplay.replaceChildren(...copy.children);
  }

  #select(option) {
    const selected = this.#getSelectedElement();
    if (option !== selected) {
      selected?.setAttribute('aria-selected', 'false');
      this.#selectedValue = option.dataset.countryCode;
      option.setAttribute('aria-selected', 'true');

      this.#updateSelectedDisplay();
    }
  }

  #addEventListeners() {
    const {input, selectedDisplay, dropdown, closeBtn} = this.#refs;
    
    const showDropdown = () => {
      input.setAttribute('aria-expanded', 'true');
      selectedDisplay.setAttribute('aria-expanded', 'true');

      input.focus();
    };

    const hideDropdown = () => {
      input.setAttribute('aria-expanded', 'false');
      selectedDisplay.setAttribute('aria-expanded', 'false');

      if (selectedDisplay.children.length > 0) selectedDisplay.focus();
    };
    
    const isExpanded = () => input.getAttribute('aria-expanded') === 'true';

    input.addEventListener('input', () => {
      if (!isExpanded()) showDropdown();
    });
    selectedDisplay.addEventListener('click', showDropdown);

    closeBtn.addEventListener('click', hideDropdown);
    this.#container.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isExpanded()) hideDropdown();
    });

    dropdown.addEventListener('click', e => {
      const option = e.target.closest('.dropdown-item');
      if (option) {
        this.#select(option);
        hideDropdown();
      }
    });
    
    input.addEventListener('input', () => {
      const term = input.value.toLowerCase().trim();
      CountrySelect.#filterOptions(term, this.#options.values());
    });

  }

  get element() {
    return this.#container;
  }

}