import Field from "./Field.js";
import icons from "../../assets/icons.js";

export default class Select {
  #field;
  #native;
  #custom;
  #trigger;
  #dropdown;

  #optionsMap = new Map();
  #optionsArray = [];
  #selectedOption = null;
  #open = false;
  #typeBuffer = '';
  #typeBufferTimeout;
  
  #renderOptions;
  #validators;

  constructor({ id, name, labelName, attrs, renderOptions, validators }) {
    const label = document.createElement('label');
    label.id = `${id}-label`;
    label.htmlFor = `${id}-native`;
    label.textContent = labelName;

    const arrow = document.createElement('span');
    arrow.className = 'select__arrow';
    arrow.innerHTML = icons.arrow;
    arrow.setAttribute('aria-hidden', 'true');

    this.#native = Select.#createNativeSelect(id, name, attrs);

    this.#custom = Select.#createCustomSelect(id);
    this.#trigger = this.#custom.querySelector('button');
    this.#dropdown = this.#custom.querySelector('ul');

    this.#field = new Field({ input: this.#native, label});
    this.#field.node.insertBefore(arrow, this.#native);
    this.#native.after(this.#custom);

    this.#renderOptions = renderOptions;
    this.#validators = validators || [];

    this.#attachEvents();
  }

  static #createNativeSelect(id, name, attrs) {
    const select = document.createElement('select');
    select.id = `${id}-native`;
    select.name = name;
    
    for (const [key, value] of Object.entries(attrs || {})) {
      select.setAttribute(key, value);
    }

    const placeholder = Object.assign(document.createElement('option'), {
      value: '',
      disabled: true,
      selected: true,
      hidden: true
    });
    select.appendChild(placeholder);

    return select;
  }

  static #createCustomSelect(id) {
    const select = document.createElement('div');
    select.className = 'custom-select';

    const trigger = document.createElement('button');
    trigger.className = 'custom-select__trigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', `${id}-listbox`);
    trigger.setAttribute('aria-labelledby', `${id}-label`);

    const dropdown = document.createElement('ul');
    dropdown.id = `${id}-listbox`;
    dropdown.className = 'custom-select__options';
    dropdown.hidden = true;
    dropdown.setAttribute('role', 'listbox');

    select.append(trigger, dropdown);
    return select;
  }

  #attachEvents() {
    this.#native.addEventListener('change', () => this.#syncFromNative());

    this.#custom.addEventListener('focusout', e => {
      if (!e.relatedTarget || !this.#custom.contains(e.relatedTarget))
        this.#closeDropdown();
    });

    this.#trigger.addEventListener('click', () => this.#toggleDropdown());

    this.#trigger.addEventListener('keydown', e => {
      const openCodes = ['ArrowUp', 'ArrowDown', 'Enter', 'Space'];
      if (this.#open || !openCodes.includes(e.code)) return;

      e.preventDefault();
      this.#openDropdown();
    });

    this.#dropdown.addEventListener('click', e => {
      const option = e.target.closest('li[role="option"]');
      if (!option) return;

      this.#select(option.dataset.value);

      this.#closeDropdown();
    });

    this.#dropdown.addEventListener('keydown', e => {
      switch (e.key) {
        case 'Tab':
          if (e.shiftKey) {
            e.preventDefault();
            this.#closeDropdown();
            this.#trigger.focus();
          }
          break;
        case 'Escape':
          e.preventDefault();
          this.#closeDropdown();
          this.#trigger.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          const next = document.activeElement.nextElementSibling ||
            this.#dropdown.querySelector('[role="option"]');
          next?.focus();
          next?.scrollIntoView({ block: 'center' });
          break;
        case 'ArrowUp':
          e.preventDefault();
          const prev = document.activeElement.previousElementSibling ||
            this.#dropdown.querySelector('li:last-child');
          prev?.focus();
          prev?.scrollIntoView({ block: 'center' });
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          this.#select(document.activeElement.dataset.value);
          this.#closeDropdown();
          this.#trigger.focus();
          break;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        this.#handleTypeahead(e.key.toLowerCase());
      }
    });
  }

  #toggleDropdown() {
    this.#open ? this.#closeDropdown(): this.#openDropdown();
  }

  #openDropdown() {
    this.#open = true;

    this.#dropdown.hidden = false;
    this.#trigger.setAttribute('aria-expanded', 'true');

    const first = this.#dropdown.querySelector('li');
    (this.#selectedOption || first)?.focus();
  }

  #closeDropdown() {
    this.#open = false;

    this.#dropdown.hidden = true;
    this.#trigger.setAttribute('aria-expanded', 'false');
  }

  #select(value) {
    this.#native.value = value;
    this.#native.dispatchEvent(new Event('change', { bubbles: true }));
  }

  #syncFromNative() {
    const value = this.#native.value;

    this.#updateTrigger(value);
    this.#highlightOption(value);
  }

  #updateTrigger(value) {
    const option = this.#optionsMap.get(value);
    this.#trigger.innerHTML = option ? option.innerHTML : '';
  }

  #highlightOption(value) {
    const newOption = this.#optionsMap.get(value);

    if (newOption === this.#selectedOption) return;

    if (this.#selectedOption) {
      this.#selectedOption.classList.remove('selected');
      this.#selectedOption.setAttribute('aria-selected', 'false');
    }

    if (newOption) {
      newOption.classList.add('selected');
      newOption.setAttribute('aria-selected', 'true');
    }

    this.#selectedOption = newOption;
  }

  #handleTypeahead(char) {
    this.#typeBuffer += char;

    clearTimeout(this.#typeBufferTimeout);
    this.#typeBufferTimeout = setTimeout(() => {
      this.#resetTypeBuffer();
    }, 400);

    const match = this.#optionsArray.find(o => {
      const name = o.dataset.search;
      return name.startsWith(this.#typeBuffer);
    });

    if (match) {
      match.focus();
      match.scrollIntoView({ block: 'center' });
    }
  }

  #resetTypeBuffer() {
    this.#typeBuffer = '';
    clearTimeout(this.#typeBufferTimeout);
  }

  populate(options) {
    this.#native.length = 1; // keep placeholder
    this.#dropdown.innerHTML = '';

    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      this.#native.append(option);

      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('tabindex', '-1');
      li.dataset.value = opt.value;

      if (this.#renderOptions) {
        this.#renderOptions(li, opt);
      } else {
        li.textContent = opt.label;
      }

      li.dataset.search = li.textContent.trim().toLowerCase();

      this.#dropdown.append(li);
    });

    this.#optionsMap = new Map(
      Array.from(
        this.#dropdown.querySelectorAll('[role="option"]'),
        o => [o.dataset.value, o]
      )
    );

    this.#optionsArray = Array.from(this.#optionsMap.values());
  }

  validate() {
    for (const validator of this.#validators) {
      const error = validator({ value: this.value });

      if (error) {
        this.#field.error = error;
        this.#native.ariaInvalid = 'true';
        return false;
      }
    }

    this.#field.error = '';
    this.#native.ariaInvalid = null;
    return true;
  }

  focus() {
    if (this.#trigger.offsetParent !== null) this.#trigger.focus();
    else this.#native.focus();
  }

  get input() {
    return this.#native;
  }

  get value() {
    return this.#native.value;
  }

  get node() {
    return this.#field.node;
  }
}