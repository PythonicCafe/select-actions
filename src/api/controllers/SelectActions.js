import Model from '../models/Model';
import MultipleSelectView from '../views/MultipleSelectView';
import SelectView from '../views/SelectView';

/**
 * @class SelectActions Controller
 *
 * @param model
 * @param view
 */
class SelectActions {
  constructor(select, options = { selectAllButtons: true, maxOptionsTags: 6, optionsData: undefined }) {
    this.select = select;
    this.model = new Model();
    this.view = document.querySelector(`${this.select} select`).multiple ?
      new MultipleSelectView(this.select, options) :
      new SelectView(this.select, options);

    // Explicit this binding
    this.model.bindOptionListChanged(this.onOptionListChanged.bind(this));
    this.view.bindSelectOption(this.handleSelectOption.bind(this));

    if (options.selectAllButtons) {
      this.view.bindChangeAllOption(this.handleChangeAllOption.bind(this));
    }
    this.view.bindSearchOption(this.handleSearchOption.bind(this));

    // Set initial options to data from HTML select options
    this.model.options = options.optionsData || this.view.app.options;
  }

  onOptionListChanged(options) {
    this.view.render(options);
  }

  handleSelectOption(value, singleOption) {
    this.model.selectOption(value, singleOption);
  }

  handleChangeAllOption(value) {
    this.model.changeAllOption(value);
  }

  handleSearchOption(value) {
    this.model.searchOption(value);
  }
}

export default SelectActions;
