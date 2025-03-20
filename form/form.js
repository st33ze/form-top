class Form {
  static create() {
    const  testElement  = document.createElement('div');
    testElement.innerHTML = 'Hello from form.js';
    return testElement;
  }
}

export default Form.create();