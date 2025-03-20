function createNode(tag, attributes={}) {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

class Form {
  static create() {
    const form = createNode('form');

    form.append(
      Form.#createHeader(),
    );

    return form;
  }

  static #createHeader() {
    const container = createNode('header');

    const header = createNode('h2');
    header.textContent = 'The Odin Project';
    const p = createNode('p');
    p.textContent = 'A form validation assignment';

    container.append(header, p);
    return container;
  }
}

export default Form.create();