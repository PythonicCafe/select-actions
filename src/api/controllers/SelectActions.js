import Model from '../models/Model';
import View from '../views/View';

/**
 * @class SelectActions Controller
 *
 * @param model
 * @param view
 */
class SelectActions {
  constructor(select, options = { selectAllButtons: true }) {
    this.select = select;
    this.model = new Model();
    this.view = new View(this.select, options);

    // Explicit this binding
    this.model.bindOptionListChanged(this.onOptionListChanged.bind(this));
    this.view.bindToggleOption(this.handleToggleOption.bind(this));
    if (options.selectAllButtons) {
      this.view.bindChangeAllOption(this.handleChangeAllOption.bind(this));
    }
    this.view.bindSearchOption(this.handleSearchOption.bind(this));

    // Set initial options to data from HTML select options
    this.model.options = this.view.app.options;
  }

  onOptionListChanged(options) {
    this.view.render(options);
  }

  handleToggleOption(value) {
    this.model.toggleOption(value);
  }

  handleChangeAllOption(value) {
    this.model.changeAllOption(value);
  }

  handleSearchOption(value) {
    this.model.searchOption(value);
  }
}

export default SelectActions;
