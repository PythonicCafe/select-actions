import {
  findTab,
  isOutOfBottomViewport,
  newElement,
  mergeObjects,
} from "./utils";

const defaultConfig = {
  borderRadius: 3,
  hideX: false,
  maxHeight: "180px",
  maxWidth: "360px",
  minWidth: "200px",
  placeholder: "Click and Select",
  search: true,
  selectAll: false,
  select: undefined,
  selectData: [],
  showOnlySelectionCount: false,
  txtAll: "All",
  txtNotFound: "Not found",
  txtRemove: "Remove",
  txtSearch: "Search field",
  txtSelected: "Selected",
  txtSelectedSingular: "Selected",
  useStyles: true,
  observeChanges: false,
  callback: undefined,
};

export default class SelectActions {
  constructor(params) {
    this.config = mergeObjects(defaultConfig, params);
    this.init();
  }

  init() {
    const self = this;
    const select = self.config.select;

    if (this.config.useStyles) {
      self._createStyles();
    }

    if (select) {
      // Create SimpleActions with defined element
      if (typeof select === "object") {
        return self._createDropdown(select);
      }

      // Create SimpleActions with string selector
      return self._createDropdown(document.querySelector(select));
    }

    // Create SimpleActions with all selects in document
    return document
      .querySelectorAll("select")
      .map((el) => self._createDropdown(el));
  }

  /**
   * Creates and appends new option elements to a given element.
   *
   * @param {Array} listOfValues - An array of objects containing option values and labels.
   * @param {HTMLElement} elToAppend - The element (a select) to which the new option elements
   * will be appended.
   *
   * @return {undefined}
   */
  createOptions(listOfValues, elToAppend) {
    for (const opt of listOfValues) {
      let optElement = newElement("option", {
        value: opt.value ? opt.value : "",
        disabled: opt.disabled ? opt.disabled : false,
        selected: opt.selected ? opt.selected : false,
      });

      optElement.innerHTML = opt.label ? opt.label : opt.value;

      elToAppend.appendChild(optElement);
    }
  }

  /**
   * Creates the dropdown element and appends it after the selectAction element.
   *
   * @param {HTMLElement} selectAction - The original select element that will be replaced by the dropdown.
   *
   * @returns {void}
   */
  _createDropdown(selectAction) {
    const self = this;

    // Select empty and data served as an array of objects
    if (!selectAction.options.length && self.config.selectData.length) {
      self.createOptions(self.config.selectData, selectAction);
    }

    const div = newElement("div", {
      class: "sa-dropdown",
      tabIndex: "0",
    });

    // Observer to original selector if options change update main dropdown
    if (self.config.observeChanges) {
      const observer = new MutationObserver(function (mutationsList, observer) {
        for (let mutation of mutationsList) {
          if (
            mutation.type === "childList" &&
            mutation.removedNodes.length > 0
          ) {
            selectAction.selectedIndex = 0;
            selectAction.dispatchEvent(new Event("change"));
            div.remove();
            self._createDropdown(mutation.target);
            this.disconnect();
          }
        }
      });

      observer.observe(selectAction, { childList: true });
    }

    const dropdownListWrapper = newElement("div", {
      class: "sa-dropdown-list-wrapper",
    });
    const dropdownList = newElement("div", {
      class: "sa-dropdown-list",
    });

    // Insert new SelectActions next original select element
    selectAction.parentNode.insertBefore(div, selectAction.nextSibling);

    // Creating search input field
    const search = newElement("input", {
      class: ["sa-dropdown-search"].concat([
        self.config.searchInput?.class ?? "form-control",
      ]),
      style: {
        width: "100%",
        display: self.config.search
          ? "block"
          : selectAction.attributes.search?.value === "true"
          ? "block"
          : "none",
      },
      placeholder: self.config.txtSearch,
    });

    dropdownListWrapper.appendChild(search);
    div.appendChild(dropdownListWrapper);
    dropdownListWrapper.appendChild(dropdownList);

    dropdownList.innerHTML = "";

    // First execution after field creation
    selectAction.addEventListener("change", function () {
      self._refresh(div, selectAction);
    });

    // Creating multiple or simple
    selectAction.multiple
      ? self._populateMultiSelect(
          dropdownList,
          dropdownListWrapper,
          selectAction
        )
      : self._populateSimpleSelect(
          div,
          dropdownList,
          selectAction,
          search,
          dropdownListWrapper
        );

    div.dropdownListWrapper = dropdownListWrapper;
    self._refresh(div, selectAction);
    self._settingEventListeners(
      div,
      search,
      dropdownList,
      dropdownListWrapper,
      selectAction
    );
  }

  /**
   * Populates the dropdown list for a simple select element.
   *
   * @param {HTMLElement} div - The container element for the simple select.
   * @param {HTMLElement} dropdownList - The element that holds the options in the dropdown list.
   * @param {HTMLSelectElement} selectAction - The original select element.
   * @param {HTMLElement} search - The search input element for the simple select.
   * @param {HTMLElement} dropdownListWrapper - The element that wraps around the dropdown list and search input.
   */
  async _populateSimpleSelect(
    div,
    dropdownList,
    selectAction,
    search,
    dropdownListWrapper
  ) {
    const self = this;
    Array.from(selectAction.options).map((option) => {
      const isDisabled = option.disabled;
      let optionElement = newElement("div", {
        target: option,
        class: isDisabled
          ? ["sa-option", "sa-unsearchable", "sa-disabled-option"]
          : "sa-option",
        tabIndex: isDisabled ? "-1" : "0",
      });
      optionElement.appendChild(newElement("label", { text: option.text }));

      dropdownList.appendChild(optionElement);

      if (!option.disabled) {
        const events = ["click", "keypress"];

        for (const eventName of events) {
          // Add eventListener to select element
          optionElement.addEventListener(eventName, async function () {
            optionElement.target.selected = true;
            selectAction.dispatchEvent(new Event("change"));
            self._closeSelect(div, search, dropdownList, dropdownListWrapper);
            if (self.config.callback) {
              await self.config.callback(self);
            }
          });
        }

        option.optionElement = optionElement;
      }
    });
  }

  /**
   * Populates a select-action dropdown list with options from a given `<select>` element.
   *
   * @param {Element} dropdownList - The dropdown list element to be populated.
   * @param {Element} dropdownListWrapper - The wrapper element of the dropdown list.
   * @param {HTMLSelectElement} selectAction - The `<select>` element containing the options to be added to the dropdown list.
   */
  _populateMultiSelect(dropdownList, dropdownListWrapper, selectAction) {
    const self = this;

    // Setting select all option
    if (self.config.selectAll || selectAction.attributes["select-all"]) {
      let optionElementAll = newElement("div", {
        class: ["sa-unsearchable", "sa-all-selector", "sa-option"],
      });

      let optionCheckbox = newElement("input", { type: "checkbox" });
      optionElementAll.appendChild(optionCheckbox);
      optionElementAll.appendChild(
        newElement("label", { text: self.config.txtAll })
      );

      optionElementAll.addEventListener("click", () => {
        optionElementAll.querySelector("input").checked =
          !optionElementAll.querySelector("input").checked;

        let ch = optionElementAll.querySelector("input").checked;
        dropdownList
          .querySelectorAll(":scope > div:not(.sa-unsearchable)")
          .forEach((i) => {
            if (i.style.display !== "none") {
              i.querySelector("input").checked = ch;
              i.target.selected = ch;
            }
          });

        selectAction.dispatchEvent(new Event("change"));
      });
      optionCheckbox.addEventListener("click", () => {
        optionCheckbox.checked = !optionCheckbox.checked;
      });

      dropdownList.appendChild(optionElementAll);
    }

    Array.from(selectAction.options).map((option) => {
      const optionElement = newElement("div", {
        target: option,
        class: "sa-option",
      });

      const optionCheckbox = newElement("input", {
        type: "checkbox",
        checked: option.selected,
      });

      optionElement.appendChild(optionCheckbox);
      optionElement.appendChild(newElement("label", { text: option.text }));

      optionElement.addEventListener("click", () => {
        const optionElementAll =
          dropdownListWrapper.querySelector(".sa-unsearchable");
        if (optionElementAll) {
          optionElementAll.querySelector("input").checked = false;
        }

        optionElement.querySelector("input").checked =
          !optionElement.querySelector("input").checked;
        optionElement.target.selected = !optionElement.target.selected;
        selectAction.dispatchEvent(new Event("change"));
      });

      optionCheckbox.addEventListener("click", () => {
        optionCheckbox.checked = !optionCheckbox.checked;
      });

      option.optionElement = optionElement;

      dropdownList.appendChild(optionElement);
    });
  }

  /**
   * This function sets up event listeners for the select dropdown.
   * It listens for input events on the search field, clicks on the dropdown field, and clicks outside the dropdown field.
   * The function also listens for keydown events on the dropdown field and the document.
   * When a matching event is triggered, it updates the options dropdown, opens or closes the select, and refreshes the dropdown field.
   *
   * @param {HTMLElement} div - The dropdown field element.
   * @param {HTMLInputElement} search - The search field element within the dropdown.
   * @param {HTMLElement} dropdownList - The options dropdown element.
   * @param {HTMLElement} dropdownListWrapper - The wrapper element for the options dropdown.
   * @param {HTMLSelectElement} selectAction - The original select element.
   */
  _settingEventListeners(
    div,
    search,
    dropdownList,
    dropdownListWrapper,
    selectAction
  ) {
    const self = this;

    // Inputs will fire update dropdown elements
    search.addEventListener("input", () => {
      self._updateOptionsDropdown(search, dropdownList, dropdownListWrapper);
    });

    // EventListener to open select
    div.addEventListener("click", (event) => {
      if (
        div !== event.target &&
        !event.target.classList.contains("sa-maxselected")
      )
        return;
      self._openSelect(div, search);
    });

    // Detect key pressed and interact with dropdown
    div.addEventListener("keydown", (event) => {
      const inputSearch = div.querySelector(".sa-dropdown-search.form-control");
      const dropdownIsHide =
        div.querySelector(".sa-dropdown-list-wrapper").style.display !== "flex";
      const activeEl = document.activeElement;

      if (event.key === "Enter" && dropdownIsHide) {
        // Dropdown open
        self._openSelect(div, search);
      } else if (event.keyCode >= 65 && event.keyCode <= 90) {
        if (dropdownIsHide) {
          // Dropdown not being displayed will open and add keypressed to inputSearch
          self._openSelect(div, search);
        } else if (activeEl !== inputSearch) {
          // Dropdown being displayed will focus and add keypressed to inputSearch
          inputSearch.focus();
        }
      } else if (event.key === "Escape") {
        // Dropdown close and focus in select
        self._closeSelect(div, search, dropdownList, dropdownListWrapper);
        self._refresh(div, selectAction);
        div.focus();
      } else if (!dropdownIsHide) {
        if (
          event.key === "ArrowUp" &&
          (activeEl.classList == "sa-option" ||
            Array.from(activeEl.parentNode.classList).includes("sa-option"))
        ) {
          event.preventDefault();
          findTab(
            div,
            'input[type="checkbox"], .sa-option',
            event.target,
            false
          ).focus();
        }
        if (
          event.key === "ArrowDown" &&
          (activeEl.classList == "sa-option" ||
            Array.from(activeEl.parentNode.classList).includes("sa-option"))
        ) {
          event.preventDefault();
          findTab(
            div,
            'input[type="checkbox"], .sa-option',
            event.target
          ).focus();
        }
      }
    });

    // EventListener to close select if open and clickout
    document.addEventListener("click", (event) => {
      if (
        !div.contains(event.target) &&
        div.dropdownListWrapper.style.display === "flex"
      ) {
        self._closeSelect(div, search, dropdownList, dropdownListWrapper);
        self._refresh(div, selectAction);
      }
    });
  }

  /**
   * Updates the options in a select-action dropdown list based on a given search query.
   *
   * @param {HTMLInputElement} search - The search input element used to filter the options in the dropdown list.
   * @param {Element} dropdownList - The dropdown list element to be updated.
   * @param {Element} dropdownListWrapper - The wrapper element of the dropdown list.
   */
  _updateOptionsDropdown(search, dropdownList, dropdownListWrapper) {
    const self = this;
    const searchLength = search.value.length;
    if (searchLength < 3 && searchLength > 0) {
      return;
    }

    let notFound = true;

    const unsearchable = dropdownListWrapper.querySelector(".sa-unsearchable");
    if (unsearchable) {
      unsearchable.style.display = searchLength ? "none" : "flex";
    }

    dropdownList
      .querySelectorAll(":scope div:not(.sa-unsearchable)")
      .forEach((div) => {
        let innerText = div
          .querySelector("label")
          .innerText.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
        if (
          innerText.includes(
            search.value
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
          )
        ) {
          div.style.display = "flex";
          notFound = false;
        } else if (!Object.values(div.classList).includes("sa-not-found")) {
          div.style.display = "none";
        }
      });

    const nfElement = dropdownList.querySelector(".sa-not-found");

    // Add not found message
    if (notFound) {
      // Not found message alrady placed
      if (nfElement) {
        return;
      }

      const nfDiv = newElement("div", {
        class: ["sa-option", "sa-not-found"],
      });
      const nfLabel = newElement("label", {
        text: self.config.txtNotFound,
      });

      nfDiv.appendChild(nfLabel);
      dropdownList.appendChild(nfDiv);

      return;
    }

    if (nfElement) {
      // Remove not found message
      nfElement.remove();
    }
  }

  /**
   * Opens a select-action dropdown list and positions it correctly based on the available viewport space.
   *
   * @param {Element} div - The element containing the dropdown list.
   * @param {HTMLInputElement} search - The search input element in the dropdown list.
   */
  _openSelect(div, search) {
    const self = this;
    const dropDownStyle = div.dropdownListWrapper.style;
    dropDownStyle.display = "flex";

    if (isOutOfBottomViewport(div.dropdownListWrapper)) {
      dropDownStyle.flexDirection = "column-reverse";
      div.querySelector(".sa-dropdown-search").style.borderTop =
        "solid 1px var(--color-border)";

      // This will update search input position if field size changes
      let prevHeight;
      self.resizeObserver = new ResizeObserver((changes) => {
        for (const change of changes) {
          if (change.contentRect.height === prevHeight) return;
          prevHeight = change.contentRect.height;

          let position = parseInt(self.config.maxHeight.replace("px", "")) + 2;
          position = div.clientHeight > 35 ? position - 35 : position;
          dropDownStyle.top = `-${position}px`;
          dropDownStyle.bottom = `0px`;
        }
      });
      self.resizeObserver.observe(div);
    } else {
      dropDownStyle.flexDirection = "column";
      div.querySelector(".sa-dropdown-search").style.borderBottom =
        "solid 1px var(--color-border)";
    }

    search.focus();
    search.select();
  }

  /**
   * Closes a select-action dropdown list and removes any positioning styles applied to it.
   *
   * @param {Element} div - The element containing the dropdown list.
   * @param {HTMLInputElement} search - The search input element in the dropdown list.
   * @param {Element} dropdownList - The dropdown list element to be closed.
   * @param {Element} dropdownListWrapper - The wrapper element of the dropdown list.
   */
  _closeSelect(div, search, dropdownList, dropdownListWrapper) {
    const self = this;

    // Remove position styles
    const dropDownStyle = div.dropdownListWrapper.style;
    const searchInput = div.querySelector(".sa-dropdown-search");
    const searchInputStyle = searchInput.style;
    dropDownStyle.display = "none";
    dropDownStyle.top = 0;
    dropDownStyle.bottom = null;
    searchInputStyle.borderTop = "0px";
    searchInputStyle.borderBottom = "0px";
    searchInput.value = "";
    self._updateOptionsDropdown(search, dropdownList, dropdownListWrapper);
    // Removing resizeObserver that defines serch position
    if (self.resizeObserver) {
      self.resizeObserver.unobserve(div);
    }
  }

  /**
   * Refreshes the visual representation of a select-action field based on its selected options.
   *
   * @param {Element} div - The element containing the visual representation of the select-action field.
   * @param {HTMLSelectElement} selectAction - The select-action element to be refreshed.
   */
  _refresh(div, selectAction) {
    const self = this;

    // Cleaning field to populate
    div
      .querySelectorAll(".sa-text, span.sa-ph, .sa-simple-del")
      .forEach((el) => div.removeChild(el));

    const selected = Array.from(selectAction.selectedOptions);
    const selectedLength = selected.length;

    if (
      (self.config.showOnlySelectionCount ||
        selectedLength > (selectAction.attributes["max-items"]?.value ?? 5)) &&
      selectedLength > 0
    ) {
      const txtAfterCounter =
        selectedLength > 1
          ? self.config.txtSelected
          : self.config.txtSelectedSingular;
      div.appendChild(
        newElement("span", {
          class: ["sa-text", "sa-option-text", "sa-maxselected"],
          text: selectedLength + " " + txtAfterCounter,
          title: `${txtAfterCounter}: \n[ ${selected
            .map((option) => option.text)
            .join(", ")} ]`,
        })
      );
    } else {
      const isMultiple = selectAction.multiple;

      selected.map((option) => {
        const classList = ["sa-text"];

        let span = newElement("span", {
          class: classList,
          text: option.text,
          target: option,
        });

        div.appendChild(span);

        if (isMultiple) {
          span.classList.add("sa-option-text");

          if (!self.config.hideX) {
            span.prepend(
              newElement("span", {
                class: ["sa-del", "sa-option-del"],
                text: "X",
                title: self.config.txtRemove,
                tabIndex: 0,
                onclick: (event) => {
                  self._removeOpt(span, div, selectAction);
                  event.stopPropagation();
                },
                onkeydown: (event) => {
                  if (event.key === "Enter") {
                    self._removeOpt(span, div, selectAction);
                    e.stopPropagation();
                  }
                },
              })
            );
          }
        } else {
          div.style = "justify-content: space-between; align-items: center";
          if (!option.disabled && !self.config.hideX) {
            div.append(
              newElement("span", {
                class: ["sa-del", "sa-option-del", "sa-simple-del"],
                text: "X",
                title: self.config.txtRemove,
                tabIndex: 0,
                onclick: (event) => {
                  self._cleanField(span, div, selectAction);
                  event.stopPropagation();
                },
                onkeydown: (event) => {
                  if (event.key === "Enter") {
                    self._cleanField(span, div, selectAction);
                    e.stopPropagation();
                  }
                },
              })
            );
          }
        }
      });
    }

    if (selectAction.selectedOptions?.length === 0) {
      div.appendChild(
        newElement("span", {
          class: ["sa-ph", "sa-placeholder"],
          text:
            selectAction.attributes?.placeholder?.value ??
            self.config.placeholder,
        })
      );
    }
  }

  /**
   * Removes the given option from the multiselect field.
   *
   * @param {HTMLElement} span - The span element representing the option to remove.
   * @param {HTMLElement} div - The div element containing the multiselect field.
   */
  _removeOpt(span, div, selectAction) {
    span.target.optionElement.dispatchEvent(new Event("click"));
    this._refresh(div, selectAction);
  }

  /**
   * Clean the given option from the simple select field.
   *
   * @param {HTMLElement} span - The span element representing the option to remove.
   * @param {HTMLElement} div - The div element containing the multiselect field.
   */
  _cleanField(span, div, selectAction) {
    span.target.parentNode.selectedIndex = 0;
    selectAction.dispatchEvent(new Event("change"));
    this._refresh(div, selectAction);
  }

  /**
   * Allow dev to set some styles customizations in select-actions instantiation
   *
   * @param {string} tag - The type of element to create.
   * @param {Object} params - An object containing the attributes to set on the new element.
   *
   * @return {HTMLElement} - The newly created element.
   */
  _createStyles() {
    const self = this;
    // TODO: create more customizations options

    let styles = {
      ".sa-dropdown": {
        "min-width": `${self.config.minWidth}`,
        "max-width": `${self.config.maxWidth}`,
        "border-radius": `${parseInt(self.config.borderRadius)}px`,
      },
      ".sa-dropdown-list-wrapper": {
        "border-top-left-radius": `${
          parseInt(self.config.borderRadius) * 0.4
        }px`,
        "border-top-right-radius": `${
          parseInt(self.config.borderRadius) * 0.4
        }px`,
      },
      ".sa-dropdown-search": {
        "border-radius": `${parseInt(self.config.borderRadius)}px`,
      },
      ".sa-dropdown-list": {
        "max-height": `${self.config.maxHeight}`,
      },
    };

    const style = document.createElement("style");

    style.setAttribute("type", "text/css");
    style.innerHTML += `${Object.keys(styles)
      .map(
        (selector) =>
          `${selector} { ${Object.keys(styles[selector])
            .map((property) => `${property}: ${styles[selector][property]}`)
            .join("; ")} }`
      )
      .join("\n")}`;

    document.head.appendChild(style);
  }
}
