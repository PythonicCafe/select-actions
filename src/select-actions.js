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

  _createDropdown(multiSelect) {
    const self = this;
    const div = this._newElement("div", { class: "sa-dropdown", "tabIndex": "0" });
    const dropdownListWrapper = this._newElement("div", {
      class: "sa-dropdown-list-wrapper",
    });
    const dropdownList = this._newElement("div", {
      class: "sa-dropdown-list",
    });

    multiSelect.parentNode.insertBefore(div, multiSelect.nextSibling);

    const search = this._newElement("input", {
      class: ["sa-dropdown-search"].concat([
        self.config.searchInput?.class ?? "form-control",
      ]),
      style: {
        width: "100%",
        display: self.config.search
        ? "block"
        : multiSelect.attributes.search?.value === "true"
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
    multiSelect.addEventListener("change", function () {
      self._refresh(div, multiSelect);
    });

    // Creating multiple or simple
    div.previousElementSibling.multiple ?
      self._populateMultiSelect(dropdownList, dropdownListWrapper, multiSelect) :
      self._populateSimpleSelect(div, dropdownList, multiSelect, search, dropdownListWrapper);

    div.dropdownListWrapper = dropdownListWrapper;
    self._refresh(div, multiSelect);
    self._settingEventListeners(div, search, dropdownList, dropdownListWrapper, multiSelect);
  }

  _populateSimpleSelect(div, dropdownList, multiSelect, search, dropdownListWrapper) {
    const self = this;
    Array.from(multiSelect.options).map((option) => {
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
          multiSelect.dispatchEvent(new Event("change"));
          self._closeSelect(div, search, dropdownList, dropdownListWrapper);
        })

        option.optionElement = optionElement;
      }
    });
  }

  _populateMultiSelect(dropdownList, dropdownListWrapper, multiSelect) {
    const self = this;

    if (
      self.config.selectAll ||
      multiSelect.attributes["select-all"]
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

        multiSelect.dispatchEvent(new Event("change"));
      });
      optionCheckbox.addEventListener("click", () => {
        optionCheckbox.checked = !optionCheckbox.checked;
      });

      dropdownList.appendChild(optionElementAll);
    }
    Array.from(multiSelect.options).map((option) => {
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
        multiSelect.dispatchEvent(new Event("change"));
      });

      optionCheckbox.addEventListener("click", () => {
        optionCheckbox.checked = !optionCheckbox.checked;
      });

      option.optionElement = optionElement;

      dropdownList.appendChild(optionElement);
    });
  }

  _settingEventListeners(div, search, dropdownList, dropdownListWrapper, multiSelect) {
    const self = this;
    search.addEventListener("input", () => {
      self._updateOptionsDropdown(search, dropdownList, dropdownListWrapper);
    });

    // EventListener to open select
    div.addEventListener("click", (event) => {
      if (div !== event.target && !event.target.classList.contains("maxselected")) return;
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
        self._refresh(div, multiSelect);
      }
    });

    div.addEventListener("keydown", (event) => {
      if (event.key === 'Escape') {
        self._closeSelect(div, search, dropdownList, dropdownListWrapper);
        self._refresh(div, multiSelect);
      }
    });
  }

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

  _isOutOfViewport(el) {
    const bounding = el.getBoundingClientRect();
    const out = {};
    out.top = bounding.top < 0;
    out.left = bounding.left < 0;
    out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
    out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
    return out.top || out.left || out.bottom || out.right;
  }

  _refresh(div, multiSelect) {
    const self = this;

    // Cleaning field to populate
    div
      .querySelectorAll(".sa-text, span.sa-ph")
      .forEach((placeholder) => div.removeChild(placeholder));

    const selected = Array.from(multiSelect.selectedOptions);
    const selectedLength = selected.length;

    if (
      (self.config.showOnlySelectionCount ||
        selectedLength > (multiSelect.attributes["max-items"]?.value ?? 5)) &&
      selectedLength > 0
    ) {
      const txtAfterCounter =
        selectedLength > 1
          ? self.config.txtSelected
          : self.config.txtSelectedSingular;
      div.appendChild(
        self._newElement("span", {
          class: ["sa-text", "sa-option-text", "maxselected"],
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
                self._deleteOpt(span, div, multiSelect);
                event.stopPropagation();
              },
              onkeydown: (event) => {
                if(event.key === 'Enter'){
                  self._deleteOpt(span, div, multiSelect);
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

    if (multiSelect.selectedOptions?.length === 0) {
      div.appendChild(
        self._newElement("span", {
          class: ["sa-ph", "sa-placeholder"],
          text:
            multiSelect.attributes?.placeholder?.value ??
            self.config.placeholder,
        })
      );
    }
  }

  _deleteOpt(span, div, multiSelect) {
    span.srcElement.optionElement.dispatchEvent(new Event("click"));
    this._refresh(div, multiSelect);
  }

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

  // This allow user to send customizations from instatiations
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
