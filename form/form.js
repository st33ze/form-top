class Form {
  static create() {
    const form = document.createElement('form');

    form.append(
      Form.#createImage(),
      Form.#createHeader(),
      Form.#createAuthSection(),
      Form.createLocalizationSection(),
    );

    return form;
  }

  static #createImage() {
    const image = document.createElement('img');
    image.src = '/form/img.webp';
    image.alt = 'Wind turbines on a green hill with a blue sky';
    return image;
  }

  static #createHeader() {
    const container = document.createElement('header');

    const header = document.createElement('h1');
    header.textContent = 'Join the Green Energy Movement';
    
    const subheader = document.createElement('h2');
    subheader.textContent = 'Fill out the form to get started!';

    container.append(header, subheader);
    return container;
  }

  static #createAuthSection() {
    const auth = document.createElement('div');
    auth.classList.add('auth-section');
    
    auth.innerHTML = `
      <label for="email">Email</label>
      <input type="email" id="email" placeholder="Email" />
      <label for="password">Password</label>
      <input type="password" id="password" placeholder="Password" />
      <label for="confirm-password">Confirm Password</label>
      <input type="password" id="confirm-password" placeholder="Confirm Password" />
    `;

    return auth;
  }

  static createLocalizationSection() {
    const localization = document.createElement('div');
    localization.classList.add('localization-section');

    localization.innerHTML = `
      <label for="country">Country</label>
      <input
        type="text"
        id="country"
        placeholder="Country"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-controls="country-dropdown"
      />
      <ul id="country-dropdown" role="listbox" tabindex="-1"></ul>
      <label for="postal">Postal Code</label>
      <input
        type="text"
        id="postal"
        placeholder="Postal Code"
        autocomplete="postal-code"
      />
    `;

    return localization;
  }
}

export default Form.create();