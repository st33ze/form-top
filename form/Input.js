export default class Input {

  static create({ type, id, labelName, required }) {
    const container = document.createElement('div');
    container.className = 'form-field';

    const input = document.createElement('input');
    input.type = type;
    input.id = id || type;
    input.placeholder = ' ';
    input.autocorrect = 'off';
    input.autocapitalize = 'none';
    input.spellcheck = 'false';
    if (required) input.setAttribute('required', '');

    const label = document.createElement('label');
    label.htmlFor = input.id;
    label.textContent = labelName || Input.capitalizeFirst(type);

    const error = document.createElement('p');
    error.className = 'form-error';
    error.hidden = true;
    error.setAttribute('aria-live', 'polite');

    container.append(label, input, error);
    return container;
  }

  static capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

}