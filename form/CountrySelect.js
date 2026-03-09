import COUNTRIES from "./countries/countries.js";
import Select from "./Select.js";

export default class CountrySelect {
  #select

  constructor(validators) {
    this.#select = new Select({
      id: 'country',
      name: 'country',
      labelName: 'Country',
      attrs: { required: '', autocomplete: 'country'},
      renderOptions: CountrySelect.#render,
      validators
    });

    this.#select.populate(COUNTRIES.map(c => ({value: c.code, label: c.name})));
  }

  static #render(li, {value, label}) {
    const img = document.createElement('img');
    img.className = 'country-flag';
    img.src = `/form/countries/flags/${value}.svg`;
    img.alt = '';
    img.loading = 'lazy';
    img.setAttribute('aria-hidden', 'true');

    const span = document.createElement('span');
    span.className = 'country-name';
    span.textContent = label;

    li.append(img, span);
  }

  validate() {
    return this.#select.validate();
  }

  get value() {
    return this.#select.value;
  }

  get node() {
    return this.#select.node;
  }
}