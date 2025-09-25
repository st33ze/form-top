export default class Input {

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