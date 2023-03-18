import { createElement, convertStringToHTML } from '../../utils';
import { closeIcon, chevronDownIcon } from '../../icons';

/**
 * @class View
 *
 * Visual representation of the model.
 */
class View {
  constructor(select, options) {
    this.select = document.querySelector(select);
    this.app = this.getElement('select');
    this.options = options;

    this.sa = convertStringToHTML(`
    <div class="sa-main-container">
      <div class="sa-container">
        <div class="sa-select" tabindex="0">
          ${chevronDownIcon}
        </div>
        <div class="sa-dropdown">
          <div class="sa-search">
            <input class="sa-search__input" type="text" placeholder="Search" name="search" />
          </div>
          ${
            options.selectAllButtons
              ? `<div class="sa-dropdown__buttons">
                <button class="sa-dropdown-button sa-button-all" data-value="all">Todos</button>
                <button class="sa-dropdown-button sa-button-none" data-value="none">Nenhum</button>
              </div>`
              : ''
          }
          <ul class="sa-dropdown__option-list"></ul>
        </div>
      </div>
    </div>
    `);
    
    // If data comming from optionsData
    if (options.optionsData) {
      const genOptions =
        this.options.optionsData.map(option => 
         convertStringToHTML(`<option value="${option.value}">${option.text}</option>`)
        );
 
      this.app.append(...genOptions)
    }

    this.app.parentElement.insertBefore(this.sa, this.app);

    this.container = this.getElement('.sa-container');
    this.dropdown = this.getElement('.sa-dropdown');
    this.inputSearch = this.getElement('.sa-search__input');
    this.optionList = this.getElement('.sa-dropdown__option-list');
    this.mainContainer = this.getElement('.sa-main-container');

    this._initLocalListeners();
  }

  _initLocalListeners() {
    this.container.addEventListener('click', (event) => {
      if (event.target.className === 'sa-select') {
        this.openDropdown();
      }
    });

    this.getElement('.sa-select').addEventListener('keydown', (event) => {
      if (event.key === 'Escape' || event.key === 'Tab') {
        return;
      }

      this.openDropdown();
    });

    this.getElement('.sa-search').addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeDropdown();
        this.getElement('.sa-select').focus();
        return;
      }
    });
  }

  clearInputSearch() {
    this.inputSearch.value = '';
    this.inputSearch.dispatchEvent(new Event('input'));
    this.inputSearch.focus();
  }

  openDropdown() {
    this.dropdown.style.display = 'block';
    this.inputSearch.focus();

    // Blur to clickout close dropdown
    const blur = createElement('div', 'sa-blur');
    this.mainContainer.append(blur);

    blur.addEventListener('click', (event) => {
      this.dropdown.style.display = 'none';
      this.mainContainer.removeChild(event.target);
      this.clearInputSearch();
    });
  }

  closeDropdown() {
    this.dropdown.style.display = 'none';
    const blur = this.getElement('.sa-blur');
    if (blur) {
      blur.remove();
    }
  }

  getElement(selector) {
    const element = this.select.querySelector(selector);
    return element;
  }

  hideSelectButtonsAll(hide) {
    if (this.options.selectAllButtons) {
      this.getElement('.sa-dropdown__buttons').style.display = hide ? 'none' : 'flex';
    }
  }

  buttonClear(handler, classList = []) {
    const buttonClear = createElement('button', ['sa-button__clear', ...classList]);
    buttonClear.innerHTML = closeIcon;

    if (handler) {
      buttonClear.addEventListener('click', () => handler());
    }

    return buttonClear;
  }


  // to be overrided
  render(){}

  // Events bind
  bindSearchOption(handler) {
    this.inputSearch.addEventListener('input', (event) => {
      handler(event.target.value);
    });
  }
}

export default View;
