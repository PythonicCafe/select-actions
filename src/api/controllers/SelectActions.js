import Model from "../models/Model"
import View from "../views/View"

/**
 * @class SelectActions Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */
class SelectActions {
  constructor(select) {
    this.model = new Model()
    this.view = new View(select)
    this.select = select

    // Explicit this binding
    this.model.bindOptionListChanged(this.onOptionListChanged.bind(this))
    this.view.bindToggleOption(this.handleToggleOption.bind(this))
    this.view.bindSearchOption(this.handleSearchOption.bind(this))

    // Set initial options to data from HTML select options
    this.model.options = this.view.getElement(this.select).options
  }

  onOptionListChanged(options) {
    this.view.render(options)
  }

  handleToggleOption(value) {
    this.model.toggleOption(value)
  }

  handleSearchOption(value) {
    this.model.searchOption(value)
  }
}

export default SelectActions;
