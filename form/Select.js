import icons from "./icons.js";
import COUNTRIES from "./countries/countries.js";

export default class CountrySelect {
  
  static create() {
    const container = Object.assign(document.createElement('div'), {
      className: 'form-field'
    });

    const label = Object.assign(document.createElement('label'), {
      id: 'country-label',
      htmlFor: 'country-native',
      textContent: 'Country'
    });
    const select = CountrySelect.#createSelect();

    container.append(label, select);
    return container;
  }

  static #createSelect() {
    const select = document.createElement('div');
    select.className = 'select';
    select.role = 'combobox';
    select.setAttribute('aria-expanded', 'false');
    select.setAttribute('aria-haspopup', 'listbox');
    select.setAttribute('aria-labelledby', 'country-label');

    select.append(
      CountrySelect.#createTrigger(),
      CountrySelect.#createDropdown(),
      CountrySelect.#createNativeSelect()
    );

    return select;
  }

  static #createTrigger() {
    const trigger = document.createElement('button');
    trigger.className = 'select__trigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-controls', 'country-listbox');
    trigger.setAttribute('aria-labelledby', 'Select a country');

    const label = Object.assign(document.createElement('span'), {
      className: 'select__label',
    });

    const arrow = document.createElement('span');
    arrow.className = 'select__arrow';
    arrow.innerHTML = icons.arrow;
    arrow.setAttribute('aria-hidden', 'true');

    trigger.append(label, arrow);
    return trigger;
  }

  static #createDropdown() {
    const list = document.createElement('ul');
    list.id = 'country-listbox';
    list.className = 'select__options';
    list.role = 'listbox';
    list.hidden = true;

    COUNTRIES.forEach(({ code, name }) => {
      const item = document.createElement('li');
      item.role = 'option';
      item.setAttribute('tabindex', '-1');
      item.dataset.value = code;

      const img = Object.assign(document.createElement('img'), {
        className: 'country-flag',
        src: `form/countries/flags/${code}.svg`,
        alt: ''
      });

      const span = Object.assign(document.createElement('span'), {
        className: 'country-name',
        textContent: name
      });

      item.append(img, span);
      list.append(item);
    });

    return list;
  }

  static #createNativeSelect() {
    const select = Object.assign(document.createElement('select'), {
      id: 'country-native',
      name: 'country',
      autocomplete: 'country',
      hidden: true
    });

    const placeholder = Object.assign(document.createElement('option'), {
      value: '',
      textContent: 'Select a country',
      disabled: true,
      selected: true,
      hidden: true
    });
    select.append(placeholder);

    COUNTRIES.forEach(({ code, name}) => {
      const option = Object.assign(document.createElement('option'), {
        value: code,
        textContent: name
      });
      select.append(option);
    });

    return select;
  }

}