import { createElement, convertStringToHTML } from "../../utils";
import { closeIcon, chevronDown } from "../../icons";

/**
 * @class View
 *
 * Visual representation of the model.
 */
class View {
  constructor(select) {
    this.select = document.querySelector(select);
    this.app = this.getElement("select");

    this.sa = convertStringToHTML(`
    <div class="sa-main-container">
      <div class="sa-container">
        <div class="sa-select" tabindex="0">
          <span class="sa-select__span">
            Select
          </span>
          ${chevronDown}
        </div>
        <div class="sa-dropdown">
          <div class="sa-search">
            <input class="sa-search__input" type="text" placeholder="Search" name="search" />
          </div>
          <ul class="sa-dropdown__option-list"></ul>
        </div>
      </div>
    </div>
    `);

    this.app.parentElement.insertBefore(this.sa, this.app);

    this.container = this.getElement(".sa-container");
    this.dropdown = this.getElement(".sa-dropdown");
    this.inputSearch = this.getElement(".sa-search__input");
    this.optionList = this.getElement(".sa-dropdown__option-list");
    this.mainContainer = this.getElement(".sa-main-container");

    this._initLocalListeners();
  }

  _initLocalListeners() {
    this.container.addEventListener("click", (event) => {
      if (event.target.className === "sa-select") {
        this.openDropdown();
      }
    });

    this.getElement(".sa-select").addEventListener("keydown", (event) => {
      if (event.key === "Escape" || event.key === "Tab") {
        return;
      }

      this.openDropdown();
    });

    this.getElement(".sa-search").addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.closeDropdown();
        this.getElement(".sa-select").focus();
        return;
      }
    });
  }

  clearInputSearch() {
    this.inputSearch.value = "";
    this.inputSearch.dispatchEvent(new Event("input"));
  }
  
  openDropdown() {
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

  closeDropdown() {
    this.dropdown.style.display = "none";
    const blur = this.getElement(".sa-blur");
    if (blur) {
      blur.remove();
    }
  }

  getElement(selector) {
    const element = this.select.querySelector(selector);
    return element;
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
      label.innerText = option.text;

      if (option.hasOwnProperty("checked")) {
        const input = createElement("input", "sa-list-li__checkbox");
        input.type = "checkbox";
        input.id = option.value;
        input.checked = option.checked;
        this.app.querySelector(`option[value='${option.value}']`).selected =
          option.checked;
        label.prepend(input);
      } else {
        label.classList.add("sa-list-li__label--empty");
      }

      li.append(label);

      this.optionList.append(li);
    }

    const clearButton = this.getElement(".sa-search__clear");

    if (this.inputSearch.value.length > 0 && !clearButton) {
      const buttonClear = createElement("button", "sa-search__clear"); 
      buttonClear.innerHTML = closeIcon;
      this.getElement(".sa-search").append(buttonClear);
      buttonClear.addEventListener("click", () => {
        this.clearInputSearch();
      });
    } else if (this.inputSearch.value.length === 0 && clearButton) {
      clearButton.remove();
    }
}

  // Events bind

  bindToggleOption(handler) {
    this.optionList.addEventListener("click", (event) => {
      if (event.target.type == "checkbox") {
        const value = event.target.closest("li").dataset.value;

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
