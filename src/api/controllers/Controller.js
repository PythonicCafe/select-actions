/**
 * @class Controller
 *
 * @param select
 * @param model
 * @param view
 */
class Controller {
  constructor(select, view, model, config) {
    this.select = select;
    this.options = config;
    this.view = new view(this.select, this.options);
    this.model = new model((this.options.optionsData || this.view.app.options), this.options);

    // Explicit this binding
    this.model.bindOptionListChanged(this.onOptionListChanged.bind(this));
    this.view.bindSelectOption(this.handleSelectOption.bind(this));

    if (this.options.selectAllButtons) {
      this.view.bindChangeAllOption(this.handleChangeAllOption.bind(this));
    }
    this.view.bindSearchOption(this.handleSearchOption.bind(this));

  }

  onOptionListChanged(options) {
    this.view.render(options);
  }

  handleSelectOption(value) {
    this.model.selectOption(value);
  }

  handleChangeAllOption(value) {
    this.model.changeAllOption(value);
  }

  handleSearchOption(value) {
    this.model.searchOption(value);
  }
}

export default Controller;
