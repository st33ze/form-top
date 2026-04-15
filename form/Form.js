import FormView from "./components/FormView/FormView.js";
import SuccessView from "./components/SuccessView.js";

export default class Form {
  
  #node
  #content

  #formView;
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

    this.#formView = new FormView({ onSuccess: () => this.#showSuccessView() });
    this.#successView = new SuccessView();

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
    this.#content.replaceChildren(this.#formView.node);
  }

  #showSuccessView() {
    this.#content.replaceChildren(this.#successView.node);
  }

  get node() {
    return this.#node;
  }
}