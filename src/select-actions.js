export default class SelectActions {
  constructor(params) {
    this.config = {
      id: undefined,
      search: true,
      hideX: false,
      useStyles: true,
      placeholder: "Click and Select",
      txtSelected: "Selected",
      txtSelectedSingular: "Selected",
      txtAll: "All",
      txtRemove: "Remove",
      txtSearch: "Search field",
      txtNotFound: "Not found",
      minWidth: "200px",
      maxWidth: "360px",
      maxHeight: "180px",
      borderRadius: 6,
      selectAll: false,
      showOnlySelectionCount: false,
      ...params,
    };

    this.init();
  }

  init() {
    const self = this;
    const selectID = self.config.id;

    if (this.config.useStyles) {
      self._createStyles();
    }

    selectID ?
      self._createDropdown(document.querySelector(selectID)) :
      document.querySelectorAll("select").map(el => self._createDropdown(el));
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
    const div = this._newElement("div", { class: "sa-dropdown", "tabIndex": "0" });
    const dropdownListWrapper = this._newElement("div", {
      class: "sa-dropdown-list-wrapper",
    });
    const dropdownList = this._newElement("div", {
      class: "sa-dropdown-list",
    });

    selectAction.parentNode.insertBefore(div, selectAction.nextSibling);

    const search = this._newElement("input", {
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

    div.previousElementSibling.multiple ?
      self._populateMultiSelect(dropdownList, dropdownListWrapper, selectAction) :
      self._populateSimpleSelect(div, dropdownList, selectAction, search, dropdownListWrapper);

    div.dropdownListWrapper = dropdownListWrapper;
    self._refresh(div, selectAction);
    self._settingEventListeners(div, search, dropdownList, dropdownListWrapper, selectAction);
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
  _populateSimpleSelect(div, dropdownList, selectAction, search, dropdownListWrapper) {
    const self = this;
    Array.from(selectAction.options).map((option) => {
      let optionElement = self._newElement("div", {
        srcElement: option,
        class: option.disabled ? ["sa-option", "sa-unsearchable", "sa-disabled-option"] : "sa-option",
      });
      optionElement.appendChild(
        self._newElement("label", { text: option.text })
      );

      dropdownList.appendChild(optionElement);

      if(!option.disabled) {
        optionElement.addEventListener("click", () => {
          optionElement.srcElement.selected = true;
          selectAction.dispatchEvent(new Event("change"));
          self._closeSelect(div, search, dropdownList, dropdownListWrapper);
        })

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

    if (
      self.config.selectAll ||
      selectAction.attributes["select-all"]
    ) {
      let optionElementAll = self._newElement("div", {
        class: ["sa-unsearchable", "sa-all-selector", "sa-option"],
      });

      let optionCheckbox = self._newElement("input", { type: "checkbox" });
      optionElementAll.appendChild(optionCheckbox);
      optionElementAll.appendChild(
        self._newElement("label", { text: self.config.txtAll })
      );

      optionElementAll.addEventListener("click", () => {
        optionElementAll.querySelector("input").checked =
          !optionElementAll.querySelector("input").checked;

        let ch = optionElementAll.querySelector("input").checked;
        dropdownList
          .querySelectorAll(
            ":scope > div:not(.sa-unsearchable)"
          )
          .forEach((i) => {
            if (i.style.display !== "none") {
              i.querySelector("input").checked = ch;
              i.srcElement.selected = ch;
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
      let optionElement = self._newElement("div", {
        srcElement: option,
        class: "sa-option"
      });
      let optionCheckbox = self._newElement("input", {
        type: "checkbox",
        checked: option.selected,
      });
      optionElement.appendChild(optionCheckbox);
      optionElement.appendChild(
        self._newElement("label", { text: option.text })
      );

      optionElement.addEventListener("click", () => {
        const optionElementAll = dropdownListWrapper.querySelector(
          ".sa-unsearchable"
        );
        if (optionElementAll) {
          optionElementAll.querySelector("input").checked = false;
        }

        optionElement.querySelector("input").checked =
          !optionElement.querySelector("input").checked;
        optionElement.srcElement.selected = !optionElement.srcElement.selected;
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
  _settingEventListeners(div, search, dropdownList, dropdownListWrapper, selectAction) {
    const self = this;
    search.addEventListener("input", () => {
      self._updateOptionsDropdown(search, dropdownList, dropdownListWrapper);
    });

    // EventListener to open select
    div.addEventListener("click", (event) => {
      if (div !== event.target && !event.target.classList.contains("sa-maxselected")) return;
      self._openSelect(div, search);
    });

    div.addEventListener("keypress", (event) => {
      if (div !== event.target) return;
      if (event.key === 'Enter') {
        self._openSelect(div, search);
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

    // EventListener to close select if open and Esc key pressed
    div.addEventListener("keydown", (event) => {
      if (event.key === 'Escape') {
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
    if (searchLength < 3 && searchLength > 0 ) {
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
        let innerText = div.querySelector("label")
          .innerText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        if (
          innerText.includes(search.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
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

      const nfDiv = self._newElement("div", { class: ["sa-option", "sa-not-found"] });
      const nfLabel = self._newElement("label", {
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

    if(this._isOutOfViewport(div.dropdownListWrapper)) {
      dropDownStyle.flexDirection = "column-reverse";
      div.querySelector(".sa-dropdown-search").style
        .borderTop = "solid 1px var(--color-border)";

      // This will update search input position if field size changes
      let prevHeight;
      self.resizeObserver = new ResizeObserver(changes => {
        for(const change of changes){
          if(change.contentRect.height === prevHeight) return
          prevHeight = change.contentRect.height

          let position = parseInt(self.config.maxHeight.replace("px", "")) + 2;
          position = div.clientHeight > 35 ? position - 35 : position;
          dropDownStyle.top = `-${position}px`;
          dropDownStyle.bottom = `0px`;
        }
      });
      self.resizeObserver.observe(div);
    } else {
      dropDownStyle.flexDirection = "column";
      div.querySelector(".sa-dropdown-search").style
        .borderBottom = "solid 1px var(--color-border)";
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
   * Determines whether an element is outside the viewport.
   *
   * @param {Element} el - The element to be checked.
   * @returns {boolean} A boolean indicating whether the element is outside the viewport.
   */
  _isOutOfViewport(el) {
    const bounding = el.getBoundingClientRect();
    const out = {};
    out.top = bounding.top < 0;
    out.left = bounding.left < 0;
    out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
    out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
    return out.top || out.left || out.bottom || out.right;
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
      .querySelectorAll(".sa-text, span.sa-ph")
      .forEach((placeholder) => div.removeChild(placeholder));

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
        self._newElement("span", {
          class: ["sa-text", "sa-option-text", "sa-maxselected"],
          text: selectedLength + " " + txtAfterCounter,
          title: `${txtAfterCounter}: \n[ ${selected
            .map((option) => option.text)
            .join(", ")} ]`,
        })
      );
    } else {
      const isMultiple = div.previousElementSibling.multiple;
      selected.map((option) => {
        let span = self._newElement("span", {
          class: isMultiple ? ["sa-text", "sa-option-text"] : ["sa-text"],
          text: option.text,
          srcElement: option,
        });

        if (!self.config.hideX && isMultiple) {
          span.prepend(
            self._newElement("span", {
              class: ["sa-del", "sa-option-del"],
              text: "X",
              title: self.config.txtRemove,
              onclick: (event) => {
                self._removeOpt(span, div, selectAction);
                event.stopPropagation();
              },
              onkeydown: (event) => {
                if(event.key === 'Enter'){
                  self._removeOpt(span, div, selectAction);
                  e.stopPropagation();
                }
              },
              tabIndex: 0
            })
          );
        }
        div.appendChild(span);
      });
    }

    if (selectAction.selectedOptions?.length === 0) {
      div.appendChild(
        self._newElement("span", {
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
    span.srcElement.optionElement.dispatchEvent(new Event("click"));
    this._refresh(div, selectAction);
  }


  /**
   * Creates a new element and sets its attributes and content based on the provided parameters.
   *
   * @param {string} tag - The tag name of the element to be created.
   * @param {Object} [params] - An object containing the attributes and content to be set on the element.
   * @param {(string|string[])} [params.class] - A class name or array of class names to be set on the element.
   * @param {Object} [params.style] - An object containing style properties and values to be set on the element.
   * @param {string} [params.text] - The text content to be set on the element.
   *
   * @returns {Element} The newly created element.
   */
  _newElement(tag, params) {
    let el = document.createElement(tag);
    if (params) {
      Object.keys(params).forEach((key) => {
        if (key === "class") {
          Array.isArray(params[key])
            ? params[key].forEach((o) =>
                o !== "" ? el.classList.add(o) : 0
              )
            : params[key] !== ""
            ? el.classList.add(params[key])
            : 0;
        } else if (key === "style") {
          Object.keys(params[key]).forEach((value) => {
            el.style[value] = params[key][value];
          });
        } else if (key === "text") {
          params[key] === ""
            ? (el.innerHTML = "&nbsp;")
            : (el.innerText = params[key]);
        } else {
          el[key] = params[key];
        }
      });
    }
    return el;
  }

  /**
   * Allow dev to set some styles customizations in select-actions instantiation
   *
   * @param {string} tag - The type of element to create.
   * @param {Object} params - An object containing the attributes to set on the new element.
   * @return {HTMLElement} - The newly created element.
   */
  _createStyles() {
    const self = this;

    let styles = {
      ":root": {
        "--border-radius--base": `${parseInt(self.config.borderRadius)}px`,
        "--border-radius--small": `${
          parseInt(self.config.borderRadius) * 0.75
        }px`,
      },
      ".sa-dropdown": {
        "min-width": `${self.config.minWidth}`,
        "max-width": `${self.config.maxWidth}`,
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
