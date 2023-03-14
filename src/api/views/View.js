import { createElement, getElement } from "../../utils";

/**
 * @class View
 *
 * Visual representation of the model.
 */
class View {
  constructor(select) {
    this.app = getElement(select);

    this.container = createElement("div", "sa-container");
    this.mainContainer = createElement("div", "sa-main-container");

    this.select = createElement("div", "sa-select");
    const span = createElement("span", "sa-select__span");
    span.innerText = "Select";
    this.select.append(span);

    this.dropdown = createElement("div", "sa-dropdown");

    this.inputSearch = createElement("input", "sa-dropdown__input-search");
    this.inputSearch.type = "text";
    this.inputSearch.placeholder = "Search";
    this.inputSearch.name = "search";

    this.optionList = createElement("ul", "sa-dropdown__option-list");

    this.dropdown.append(this.inputSearch, this.optionList);

    this.container.append(this.select, this.dropdown);
    this.mainContainer.append(this.container);

    this.app.parentElement.insertBefore(this.mainContainer, this.app);

    this._initLocalListeners();
  }

  _initLocalListeners() {
    this.container.addEventListener("click", (event) => {
      if (event.target.className === "sa-select") {
        this.dropdown.style.display = "block";
        this.inputSearch.focus();

        // Blur to clickout close dropdown
        const blur = createElement("div", "sa-blur");
        this.mainContainer.append(blur);

        blur.addEventListener("click", (event) => {
          this.dropdown.style.display = "none";
          this.mainContainer.removeChild(event.target);
        });
      }
    });
  }

  render(options) {
    // Remove all options
    while (this.optionList.firstChild) {
      this.optionList.removeChild(this.optionList.firstChild);
    }

    // Render updated version
    for (const option of options) {
      const li = createElement("li", "sa-list-li");
      li.dataset.value = option.value;

      const label = createElement("label", "sa-list-li__label");
      label.htmlFor = option.value;
      label.innerText = option.text;

      if (option.hasOwnProperty("checked")) {
        const input = createElement("input", "sa-list-li__checkbox");
        input.type = "checkbox";
        input.id = option.value;
        input.checked = option.checked;
        this.app.querySelector(`option[value='${option.value}']`).selected =
          option.checked;
        li.append(input);
      } else {
        label.classList.add("sa-list-li__label--empty");
      }

      li.append(label);

      this.optionList.append(li);
    }
  }

  // Events bind

  bindToggleOption(handler) {
    this.optionList.addEventListener("click", (event) => {
      if (event.target.type === "checkbox") {
        const value = event.target.parentElement.dataset.value;

        handler(value);
      }
    });
  }

  bindSearchOption(handler) {
    this.inputSearch.addEventListener("input", (event) => {
      handler(event.target.value);
    });
  }
}

export default View;
