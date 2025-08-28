class Form {
  static create() {
    const form = document.createElement('form');

    form.append(
      Form.#createHeader(),
      Form.#createAuthSection(),
      Form.#createLocalizationSection(),
      Form.#createButton(),
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
        <input type="email" 
               id="email" placeholder=" " 
               autocorrect="off" 
               autocapitalize="none" 
               spellcheck="false"/>
        <label for="email">Email</label>
      </div>
      <div class="form-element">
        <input type="password" 
               id="password" placeholder=" " 
               autocorrect="off" 
               autocapitalize="none" 
               spellcheck="false"/>
        <label for="password">Password</label>
      </div>
      <div class="form-element">
        <input type="password" 
               id="confirm-password" 
               placeholder=" " 
               autocorrect="off" 
               autocapitalize="none" 
               spellcheck="false"/>
        <label for="confirm-password">Confirm Password</label>
      </div>
    `;

    return auth;
  }

  static #createLocalizationSection() {
    const localization = document.createElement('div');
    localization.classList.add('localization-section');

    localization.innerHTML = `
      <div class="form-element">
        <div class="country-select">
          <div id="country-input"
               class="country-input"
               contenteditable="true"
               role="combobox"
               aria-labelledby="country-label"
               aria-expanded="false"
               aria-autocomplete="list"
               aria-owns="country-dropdown"
               aria-haspopup="listbox"
               aria-controls="country-dropdown">
          </div>
          <div id="country-dropdown"
               class="dropdown hidden"
               role="listbox">
          </div>
          <input type="hidden" name="country_code" id="country-code">
        </div>
        <label id="country-label">Country</label>
      </div>
      <div class="form-element">
        <input type="text"
               id="postal" 
               placeholder=" " 
               autocomplete="postal-code" 
               autocorrect="off" 
               autocapitalize="none" 
               spellcheck="false"/>
        <label for="postal">Postal Code</label>
      </div>
    `;

    return localization;
  }

  static #createButton() {
    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Submit';

    button.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('Form submitted');
    });

    return button;
  }
}

export default Form.create();