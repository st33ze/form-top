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
      Form.#createAuthSection(),
    );

    return form;
  }

  static #createHeader() {
    const container = createNode('header');

    const header = createNode('h1');
    header.textContent = 'Join the Green Energy Movement';
    
    const subheader = createNode('h2');
    subheader.textContent = 'Fill out the form to get started!';

    container.append(header, subheader);
    return container;
  }

  static #createAuthSection() {
    const login = createNode('div', { class: 'auth-section' });
    login.innerHTML = `
      <p>
        <label for="email">Email</label>
        <input type="email" id="email" placeholder="Email" />
      </p>
      <p>
        <label for="password">Password</label>
        <input type="password" id="password" placeholder="Password" />
      </p>
      <p>
        <label for="confirm-password">Confirm Password</label>
        <input type="password" id="confirm-password" placeholder="Confirm Password" />
      </p>
    `;

    return login;
  }
}

export default Form.create();