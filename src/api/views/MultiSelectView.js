import View from './View';
import { createElement, trapFocus } from '../../utils';

class MultiSelectView extends View {
  constructor(select, config) {
    super(select, config);
  }

  selectedOption(text, value) {
    const selectedOption = createElement('div', 'sa-selected-option');
    const span = createElement('span', 'sa-selected-option__span');
    span.title = text;
    span.innerHTML = text;
    selectedOption.append(span);
    selectedOption.dataset.value = value;
    selectedOption.append(this.buttonClear());
    this.getElement('.sa-select').append(selectedOption);
  }

  selectedOptionCounter(length) {
    const selectedOption = createElement('div', ['sa-selected-option', 'sa-selected-option--counter']);
    selectedOption.innerHTML = length + ' selected';
    this.getElement('.sa-select').append(selectedOption);
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

    const checkedOptionsLength = options.filter((x) => x.checked == true).length;
    const displayCounter = checkedOptionsLength > this.config.maxOptionsTags;
    if (displayCounter) {
      this.selectedOptionCounter(checkedOptionsLength);
    }

    // Render updated version
    for (const option of options) {
      const li = createElement('li', 'sa-list-li');
      li.dataset.value = option.value;

      const label = createElement('label', 'sa-list-li__label');
      label.innerText = option.text;
      label.tabIndex = 0;

      if (option.hasOwnProperty('checked')) {
        const input = createElement('input', 'sa-list-li__checkbox');
        input.type = 'checkbox';
        input.id = option.value;
        input.checked = option.checked;
        input.tabIndex = -1;
        this.app.querySelector(`option[value='${option.value}']`).selected = option.checked;
        label.prepend(input);

        if (option.checked && !displayCounter) {
          this.selectedOption(option.text, option.value);
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
      span.innerText = this.config.fieldsTexts.selectPlaceholder;
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

    // If dropdown opened trapfocus
    if (this.dropdown.style.display === 'block') {
      trapFocus(this.dropdown);
    }
  }

  // Events bind

  bindSelectOption(handler) {
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

    this.getElement('.sa-select').addEventListener('keydown', (event) => {
      event.stopPropagation();
      if (
        event.key === 'Enter' &&
        event.target.closest('button') &&
        [...event.target.closest('button').classList].includes('sa-button__clear')
      ) {
        handler(event.target.closest('.sa-selected-option').dataset.value);
        this.getElement('.sa-select').focus();
      }
    });

    this.getElement('.sa-dropdown').addEventListener('keydown', (event) => {
      if (event.target.tagName === 'LABEL') {
        const label = `[data-value='${event.target.closest('li').dataset.value}'] label`;
        if (event.key === 'Enter') {
          handler(event.target.closest('li').dataset.value);
          this.getElement(label).focus();
        }
      }
    });
  }

  bindChangeAllOption(handler) {
    this.getElement('.sa-dropdown__buttons').addEventListener('click', (event) => {
      const value = event.target.closest('button').dataset.value;
      handler(value);
    });
  }
}

export default MultiSelectView;
