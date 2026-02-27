export default class Input {

  static create({ type, id, labelName, attrs = {} }) {
    const container = document.createElement('div');
    container.className = 'form-field';

    const input = document.createElement('input');
    input.type = type;
    input.id = id || type;
    input.placeholder = ' ';
    input.autocorrect = 'off';
    input.autocapitalize = 'none';
    input.spellcheck = 'false';

    for (const [key, value] of Object.entries(attrs)) {
      input.setAttribute(key, value);
    }

    const label = document.createElement('label');
    label.htmlFor = input.id;
    label.textContent = labelName || Input.#capitalizeFirst(type);

    const error = document.createElement('p');
    error.className = 'form-error';
    error.hidden = true;
    error.setAttribute('aria-live', 'polite');

    container.append(label, input, error);
    return container;
  }

  static #capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static validate(input, error = '') {
    const field = input.closest('.form-field');
    const errorElement = field?.querySelector('.form-error');

    if (input.required && !input.value.trim()) {
      error = 'Field required';
    }

    if (errorElement) {
      errorElement.textContent = error;
      errorElement.hidden = !error;
    }

    input.ariaInvalid = error ? 'true': null;
    
    return !error;
  }

}