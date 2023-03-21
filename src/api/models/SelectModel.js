import Model from './Model';

/**
 * @class Model
 *
 * Manages the data of the application.
 */
class SelectModel extends Model {
  constructor(options, config) {
    super(options, config);
  }

  selectOption(value) {
    this.options = this.options.map((opt) => {
      return { value: opt.value, text: opt.text, checked: false };
    });
    this.options.find((opt) => opt.value === value).checked = true;
    this.defaultOptions = this.defaultOptions.map((opt) => {
      return { value: opt.value, text: opt.text, checked: false };
    });

    this.defaultOptions = this.defaultOptions.map((opt) =>
      opt.value === value ? { value: opt.value, text: opt.text, checked: !opt.checked } : opt,
    );

    this.commit(this.options);
  }
}

export default SelectModel;
