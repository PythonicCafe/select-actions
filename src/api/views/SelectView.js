import View from './View';
import { createElement } from '../../utils';

class SelectView extends View {
  constructor(select, config) {
    super(select, config);

    // Single select starts with first element selected
    if (config.optionsData) {
      config.optionsData[0].checked = true;
    }
  }

  selectedOption(text, value) {
    const selectedOption = createElement('div', ['sa-selected-option', 'sa-selected-option--single']);
    selectedOption.innerHTML = text;
    selectedOption.dataset.value = value;
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

    // Render updated version
    for (const option of options) {
      const li = createElement('li', 'sa-list-li');
      li.dataset.value = option.value;

      const label = createElement('label', ['sa-list-li__label', 'sa-list-li__label--single']);
      label.innerText = option.text;
      label.tabIndex = 0;

      if (option.hasOwnProperty('checked')) {
        if (option.checked) {
          this.app.value = option.value;
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

  // Events
  bindSelectOption(handler) {
    this.optionList.addEventListener('click', (event) => {
      if (event.target.tagName == 'LABEL' && event.target.closest('li').dataset.value !== 'undefined') {
        handler(event.target.closest('li').dataset.value, true);
        this.closeDropdown();
      }
    });

    this.getElement('.sa-dropdown').addEventListener('keydown', (event) => {
      if (event.target.tagName === 'LABEL') {
        if (event.key === 'Enter') {
          handler(event.target.closest('li').dataset.value);
          this.closeDropdown();
          this.getElement('.sa-select').focus();
        }
      }
    });
  }
}

export default SelectView;
