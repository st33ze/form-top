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

    const arrow = document.createElement('span');
    arrow.className = 'select__arrow';
    arrow.innerHTML = icons.arrow;
    arrow.setAttribute('aria-hidden', 'true');

    const native = CountrySelect.#createNativeSelect();

    const custom = CountrySelect.#createCustomSelect();

    container.append(label, arrow, native, custom);

    CountrySelect.#attachCustomListeners(container);

    return container;
  }

  static #createNativeSelect() {
    const select = Object.assign(document.createElement('select'), {
      id: 'country-native',
      name: 'country',
      autocomplete: 'country',
    });

    const placeholder = Object.assign(document.createElement('option'), {
      value: '',
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

  static #createCustomSelect() {
    const select = document.createElement('div');
    select.className = 'custom-select';
    select.role = 'combobox';
    select.setAttribute('role', 'combobox');
    select.setAttribute('aria-expanded', 'false');
    select.setAttribute('aria-haspopup', 'listbox');
    select.setAttribute('aria-labelledby', 'country-label');

    const trigger = document.createElement('button');
    trigger.className = 'custom-select__trigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-controls', 'country-listbox');

    const dropdown = CountrySelect.#createDropdown();

    select.append(trigger, dropdown);
    return select;
  }

  static #createDropdown() {
    const list = document.createElement('ul');
    list.id = 'country-listbox';
    list.className = 'custom-select__options';
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

  static #attachCustomListeners(container) {
    const custom = container.querySelector('.custom-select');
    const trigger = custom.querySelector('.custom-select__trigger');
    const dropdown = custom.querySelector('.custom-select__options');
    const native = container.querySelector('#country-native');

    const open = () => {
      dropdown.hidden = false;
      custom.setAttribute('aria-expanded', 'true');

      const selected = dropdown.querySelector('[aria-selected="true"]');
      const first = dropdown.querySelector('li');
      (selected || first)?.focus();
    };

    const close = () => {
      dropdown.hidden = true;
      custom.setAttribute('aria-expanded', 'false');
    };

    const select = option => {
      const selected = dropdown.querySelector('[aria-selected="true"]');

      if (option && option !== selected) {
        selected?.setAttribute('aria-selected', 'false');
        selected?.classList.remove('selected');
        option.setAttribute('aria-selected', 'true');
        option.classList.add('selected');

        native.value = option.dataset.value;

        const clone = option.cloneNode(true);
        trigger.innerHTML = '';
        trigger.append(...clone.children);
      }
    };

    let typeBuffer = '';
    let typeBufferTimeout;

    const resetTypeBuffer = () => {
      typeBuffer = '';
      clearTimeout(typeBufferTimeout);
    }

    const handleTypeahead = char => {
      typeBuffer += char;

      clearTimeout(typeBufferTimeout);
      typeBufferTimeout = setTimeout(resetTypeBuffer, 400);

      const options = [...dropdown.querySelectorAll('[role="option"]')];

      const match = options.find(o => {
        const name = o.querySelector('.country-name').textContent;
        return name.toLowerCase().startsWith(typeBuffer);
      });

      if (match) {
        match.focus();
        match.scrollIntoView({ block: 'center' });
      }
    }

    custom.addEventListener('focusout', e => {
      if (!e.relatedTarget || !custom.contains(e.relatedTarget))
        close();
    });

    trigger.addEventListener('click', () => {
      if (dropdown.hidden) open();
      else close();
    });
    
    trigger.addEventListener('keydown', e => {
      const openKeys = ['ArrowUp', 'ArrowDown', 'Enter', 'Spacebar', ' '];
      if (!dropdown.hidden || !openKeys.includes(e.key)) return;

      e.preventDefault();
      open();
    });

    dropdown.addEventListener('click', e => {
      const option = e.target.closest('li[role="option"');
      select(option);
      close();
    });

    dropdown.addEventListener('keydown', e => {
      switch (e.key) {
        case 'Tab':
          if (e.shiftKey) {
            e.preventDefault();
            close();
            trigger.focus();
          }
          break;

        case 'Escape':
          e.preventDefault();
          close();
          trigger.focus();
          break;

        case 'ArrowDown':
          e.preventDefault();
          const next = document.activeElement.nextElementSibling || dropdown.querySelector('[role="option"]');
          next?.focus();
          next?.scrollIntoView({ block: 'center' });
          break;

        case 'ArrowUp':
          e.preventDefault();
          const prev = document.activeElement.previousElementSibling || dropdown.querySelector('li:last-child');
          prev?.focus();
          prev?.scrollIntoView({ block: 'center' });
          break;

        case 'Enter':
        case ' ':
        case 'Spacebar':
          e.preventDefault();
          select(document.activeElement);
          close();
          trigger.focus();
          break;
      }

      if (e.key.length === 1 && /^[a-z]$/i.test(e.key)) {
        handleTypeahead(e.key.toLowerCase());
      }
    });
  }

}