function createNode(tag, attributes={}) {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

class Form {
  static create() {
    const  testElement  = document.createElement('div');
    testElement.innerHTML = 'Hello from form.js';
    return testElement;
  }
}

export default Form.create();