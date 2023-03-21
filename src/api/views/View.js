import { createElement, convertStringToHTML, trapFocus } from '../../utils';
import { closeIcon, chevronDownIcon } from '../../icons';

/**
 * @class View
 *
 * Visual representation of the model.
 */
class View {
  constructor(select, config) {
    this.select = select;
    this.app = this.getElement('select');
    this.config = config;

    this.sa = convertStringToHTML(`
    <div class="sa-main-container">
      <div class="sa-container">
        <div class="sa-select" tabindex="0">
          ${chevronDownIcon}
        </div>
        <div class="sa-dropdown">
          <div class="sa-search">
            <input class="sa-search__input" type="text" placeholder="${this.config.fieldsTexts.searchPlaceholder}" name="search" />
          </div>
          <ul class="sa-dropdown__option-list" tabindex="-1" ></ul>
        </div>
      </div>
    </div>
    `);

    // If data comming from optionsData
    if (Array.isArray(config.optionsData)) {
      const genOptions = this.config.optionsData.map((option) =>
        convertStringToHTML(`<option value="${option.value}">${option.text}</option>`),
      );

      this.app.append(...genOptions);
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
      if (event.key === 'Escape' || event.key === 'Tab' || event.key === 'Shift') {
        return;
      }

      if (event.target.tagName !== 'BUTTON') {
        this.openDropdown();
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.getElement('.sa-list-li__label').focus();
      }
    });

    this.dropdown.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeDropdown();
        this.getElement('.sa-select').focus();
      }
    });

    this.getElement('.sa-dropdown').addEventListener('keydown', (event) => {
      if (event.target.tagName === 'LABEL') {
        const label = `[data-value='${event.target.closest('li').dataset.value}'] label`;
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          this.findTabStop('.sa-dropdown__option-list', label).focus();
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          this.findTabStop('.sa-dropdown__option-list', label, false).focus();
        }
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
    trapFocus(this.dropdown);

    // Blur to clickout close dropdown
    const blur = createElement('div', 'sa-blur');
    this.mainContainer.append(blur);

    blur.addEventListener('click', () => {
      this.closeDropdown();
    });
  }

  closeDropdown() {
    this.dropdown.style.display = 'none';
    this.clearInputSearch();
    const blur = this.getElement('.sa-blur');
    if (blur) {
      blur.remove();
    }
  }

  getElement(selector) {
    const element = this.select.querySelector(selector);
    return element;
  }

  findTabStop(universe, selector, next = true) {
    const element = this.getElement(selector);
    const container = this.select.querySelector(universe).querySelectorAll(element.tagName);
    const list = Array.prototype.filter.call(container, (item) => item.tabIndex >= '0');
    const index = list.indexOf(element);

    if (next) {
      return list[index + 1] || list[0];
    }

    return list[index - 1] || list[list.length - 1];
  }

  hideSelectButtonsAll(hide) {
    if (this.config.selectAllButtons) {
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

  // to be overridden
  render() {}

  // Events bind
  bindSearchOption(handler) {
    this.inputSearch.addEventListener('input', (event) => {
      handler(event.target.value);
    });

    this.inputSearch.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.getElement('.sa-list-li__label').focus();
      }
    });
  }
}

export default View;
