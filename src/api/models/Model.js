/**
 * @class Model
 *
 * Manages the data of the application.
 */
class Model {
  constructor(data, config) { 
    this.config = config;
    if (data instanceof HTMLOptionsCollection) {
      this.options = [...data].map((opt) => {
        return {
          value: opt.value,
          text: opt.innerHTML,
          checked: opt.selected,
        };
      });
    } else {
      this.options = data.map((opt) => {
        return { ...opt, checked: opt.checked };
      });
    }

    this.defaultOptions = this.options;
  }

  bindOptionListChanged(callback) {
    this.onOptionListChanged = callback;
  }

  commit(options) {
    this.onOptionListChanged(options);
  }

  // To be overridden
  selectOption() {}

  changeAllOption(value) {
    let newValue = value === 'all' ? true : false;

    this.options = this.options.map((opt) => {
      return { value: opt.value, text: opt.text, checked: newValue };
    });
    this.defaultOptions = this.defaultOptions.map((opt) => {
      return { value: opt.value, text: opt.text, checked: newValue };
    });

    this.commit(this.options);
  }

  searchOption(value) {
    this.options = this.defaultOptions;
    this.options = this.options.filter((option) => option.text.includes(value));

    if (this.options.length === 0) {
      this.options = [{ text: this.config.fieldsTexts.notFoundMessage }];
    }
    this.commit(this.options);
  }
}

export default Model;
