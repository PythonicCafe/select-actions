import Controller from './Controller';
import MultiSelectModel from '../models/MultiSelectModel';
import MultiSelectView from '../views/MultiSelectView';
import SelectModel from '../models/SelectModel';
import SelectView from '../views/SelectView';
import { defaultOptions } from '../helpers/ControllerHelpers';

/**
 * @class SelectActions Controller
 *
 * @param select
 * @param model
 * @param view
 */
class SelectActions extends Controller {
  constructor(select,
    config
  ) {
    const selectElement = document.querySelector(`${select}`);
    const isMulti = selectElement.querySelector(`select`).multiple;
    if (isMulti) {
      super(selectElement, MultiSelectView, MultiSelectModel, { ...defaultOptions, ...config });
      if (this.options.selectAllButtons) {
        this.view.bindChangeAllOption(this.handleChangeAllOption.bind(this));
      }
    }
    else { 
      super(selectElement, SelectView, SelectModel, { ...defaultOptions, ...config });
    }

    // Set initial options to data from HTML select options
    this.onOptionListChanged(this.model.options);

  }
}

export default SelectActions;
