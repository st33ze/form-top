import FormFields from "./FormFields.js";
import SuccessView from "./SuccessView.js";

export default class Form {
  
  #node
  #content

  #fields;
  #successView;

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
    this.#successView = new SuccessView();

    // this.#showForm();
    this.#showSuccessView();
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

  #showSuccessView() {
    this.#content.replaceChildren(this.#successView.node);
  }

  get node() {
    return this.#node;
  }
}