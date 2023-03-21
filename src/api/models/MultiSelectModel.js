import Model from './Model';

/**
 * @class Model
 *
 * Manages the data of the application.
 */
class MultiSelectModel extends Model {
  constructor(options, config) {
    super(options, config);
  }

  selectOption(value) {
    this.options = this.options.map((opt) =>
      opt.value === value ? { value: opt.value, text: opt.text, checked: !opt.checked } : opt,
    );
    this.defaultOptions = this.defaultOptions.map((opt) =>
      opt.value === value ? { value: opt.value, text: opt.text, checked: !opt.checked } : opt,
    );

    this.commit(this.options);
  }
}

export default MultiSelectModel;
