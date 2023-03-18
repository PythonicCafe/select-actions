/**
 * @class Model
 *
 * Manages the data of the application.
 */
class Model {
  #options = [];
  #defaultOptions = [];

  get options() {
    return this.#options;
  }

  set options(options) {
    if (options instanceof HTMLOptionsCollection) {
      this.#options = [...options].map((option) => {
        return {
          value: option.value,
          text: option.innerHTML,
          checked: option.selected,
        };
      });
    } else {
      this.#options = options;
    }

    this.#defaultOptions = this.#options;
    this.#commit(this.#options);
  }

  bindOptionListChanged(callback) {
    this.onOptionListChanged = callback;
  }

  #commit(options) {
    this.onOptionListChanged(options);
  }

  selectOption(value, singleOption = false) {
    if (singleOption) {
      this.#options = this.#options.map((opt) => { return { value: opt.value, text: opt.text, checked: false } });
      this.#options.find((opt) => opt.value === value).checked = true;
      this.#defaultOptions = this.#defaultOptions.map((opt) => { return { value: opt.value, text: opt.text, checked: false } });
    } else {
      this.#options = this.#options.map((opt) =>
        opt.value === value ? { value: opt.value, text: opt.text, checked: !opt.checked } : opt,
      );
    }

    this.#defaultOptions = this.#defaultOptions.map((opt) =>
      opt.value === value ? { value: opt.value, text: opt.text, checked: !opt.checked } : opt,
    );

    this.#commit(this.#options);
  }

  changeAllOption(value) {
    let newValue = value === 'all' ? true : false;

    this.#options = this.#options.map((opt) => {
      return { value: opt.value, text: opt.text, checked: newValue };
    });
    this.#defaultOptions = this.#defaultOptions.map((opt) => {
      return { value: opt.value, text: opt.text, checked: newValue };
    });

    this.#commit(this.#options);
  }

  searchOption(value) {
    this.#options = this.#defaultOptions;
    this.#options = this.#options.filter((option) => option.text.includes(value));

    if (this.#options.length === 0) {
      this.#options = [{ text: 'Nothing found' }];
    }
    this.#commit(this.#options);
  }
}

export default Model;
