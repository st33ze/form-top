import FormFields from "./FormFields.js";

export default class Form {
  
  #node
  #content

  #fields;

  constructor() {
    this.#node = document.createElement('div');
    this.#node.classList.add('form-container');

    this.#content = document.createElement('div');
    this.#content.classList.add('form-content');

    this.#node.append(
      Form.#createHeader(),
      this.#content
    );

    this.#fields = new FormFields();

    this.#showForm();
  }

  static #createHeader() {
    const container = document.createElement('header');

    const header = document.createElement('h1');
    header.textContent = 'charge into tomorrow';

    container.appendChild(header);
    return container;
  }

  #showForm() {
    this.#content.replaceChildren(this.#fields.node);
  }

  get node() {
    return this.#node;
  }
}