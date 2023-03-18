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

  render(options) {
    // Remove all options
    while (this.optionList.firstChild) {
      this.optionList.removeChild(this.optionList.firstChild);
    }
    while (this.getElement('.sa-selected-option')) {
      this.getElement('.sa-selected-option').remove();
    }

    if (this.getElement('.sa-selected__span')) {
      this.getElement('.sa-selected__span').remove();
    }

    // Render updated version
    for (const option of options) {
      const li = createElement('li', 'sa-list-li');
      li.dataset.value = option.value;

      const label = createElement('label', 'sa-list-li__label');
      label.innerText = option.text;

      if (option.hasOwnProperty('checked')) {
        const input = createElement('input', 'sa-list-li__checkbox');
        input.type = 'checkbox';
        input.id = option.value;
        input.checked = option.checked;
        this.app.querySelector(`option[value='${option.value}']`).selected = option.checked;
        label.prepend(input);

        if (option.checked) {
          const selectedOption = createElement('div', 'sa-selected-option');
          selectedOption.innerHTML = option.text;
          selectedOption.dataset.value = option.value;
          selectedOption.append(this.buttonClear());
          this.getElement('.sa-select').append(selectedOption);
        }
      } else {
        label.classList.add('sa-list-li__label--empty');
      }

      li.append(label);

      this.optionList.append(li);
    }

    if (!this.getElement('.sa-selected-option')) {
      // Select label create and add
      const span = createElement('span', 'sa-selected__span');
      span.innerText = 'Select';
      this.getElement('.sa-select').append(span);
    }

    // InputSearch clear button
    const clearButton = this.getElement('.sa-search>.sa-search__clear');

    if (this.inputSearch.value.length > 0 && !clearButton) {
      this.hideSelectButtonsAll(true);
      this.getElement('.sa-search').append(this.buttonClear(this.clearInputSearch.bind(this), ['sa-search__clear']));
    } else if (this.inputSearch.value.length === 0 && clearButton) {
      this.hideSelectButtonsAll(false);
      clearButton.remove();
    }
  }

  // Events bind

  bindToggleOption(handler) {
    this.optionList.addEventListener('click', (event) => {
      if (event.target.type == 'checkbox') {
        handler(event.target.closest('li').dataset.value);
      }
    });

    this.getElement('.sa-select').addEventListener('click', (event) => {
      if (
        event.target.closest('button') &&
        [...event.target.closest('button').classList].includes('sa-button__clear')
      ) {
        handler(event.target.closest('.sa-selected-option').dataset.value);
      }
    });
  }

  bindChangeAllOption(handler) {
    this.getElement('.sa-dropdown__buttons').addEventListener('click', (event) => {
      const value = event.target.closest('button').dataset.value;
      handler(value);
    });
  }

  bindSearchOption(handler) {
    this.inputSearch.addEventListener('input', (event) => {
      handler(event.target.value);
    });
  }
}

export default View;
