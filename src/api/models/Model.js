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
    this.#options = [...options].map((option) => {
      return {
        value: option.value,
        text: option.innerHTML,
        checked: option.selected,
      };
    });

    this.#defaultOptions = this.#options;
    this.#commit(this.#options);
  }

  bindOptionListChanged(callback) {
    this.onOptionListChanged = callback;
  }

  #commit(options) {
    this.onOptionListChanged(options);
  }

  toggleOption(value) {
    this.#options = this.#options.map((opt) =>
      opt.value === value
        ? { value: opt.value, text: opt.text, checked: !opt.checked }
        : opt
    );
    this.#defaultOptions = this.#defaultOptions.map((opt) =>
      opt.value === value
        ? { value: opt.value, text: opt.text, checked: !opt.checked }
        : opt
    );

    this.#commit(this.#options);
  }

  searchOption(value) {
    this.#options = this.#defaultOptions;
    this.#options = this.#options.filter((option) =>
      option.text.includes(value)
    );

    if (this.#options.length === 0) {
      this.#options = [{ text: "Nothing found" }];
    }
    this.#commit(this.#options);
  }
}

export default Model;
