class Form {
  static create() {
    const form = document.createElement('form');

    form.append(
      Form.#createHeader(),
      Form.#createAuthSection(),
      Form.createLocalizationSection(),
    );

    return form;
  }

  static #createHeader() {
    const container = document.createElement('header');

    const header = document.createElement('h1');
    header.textContent = 'charge into tomorrow';
    
    container.appendChild(header);
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