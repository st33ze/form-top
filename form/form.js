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
      <div class="form-element">
        <input type="email" id="email" placeholder=" " />
        <label for="email">Email</label>
      </div>
      <div class="form-element">
        <input type="password" id="password" placeholder=" " />
        <label for="password">Password</label>
      </div>
      <div class="form-element">
        <input type="password" id="confirm-password" placeholder=" " />
        <label for="confirm-password">Confirm Password</label>
      </div>
    `;

    return auth;
  }

  static createLocalizationSection() {
    const localization = document.createElement('div');
    localization.classList.add('localization-section');

    localization.innerHTML = `
      <div class="form-element">
        <input
          type="text"
          id="country"
          placeholder=" "
          aria-haspopup="listbox"
          aria-expanded="false"
          aria-controls="country-dropdown"
        />
        <label for="country">Country</label>
        <ul id="country-dropdown" role="listbox" tabindex="-1"></ul>
      </div>
      <div class="form-element">
        <input
          type="text"
          id="postal"
          placeholder=" "
          autocomplete="postal-code"
        />
        <label for="postal">Postal Code</label>
      </div>
    `;

    return localization;
  }
}

export default Form.create();