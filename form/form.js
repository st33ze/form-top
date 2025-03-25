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

    const header = createNode('h1');
    header.textContent = 'Join the Green Energy Movement';
    
    const p = createNode('p');
    p.innerHTML = '<span>Fill out the form to get started!</span><span>Switch to renewable energy and build a sustainable future.</span>';

    container.append(p, header);
    return container;
  }
}

export default Form.create();