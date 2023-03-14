/**
 * @class View
 *
 * Visual representation of the model.
 */
class View {
  constructor(select) {
    this.app = this.getElement(select)

    this.container = this.createElement("div", "sa-container")
    this.mainContainer = this.createElement("div", "sa-main-container")

    this.select = this.createElement("div", "sa-select")
    const span = this.createElement("span", "sa-select__span")
    span.innerText = "Select"
    this.select.append(span)

    this.dropdown = this.createElement("div", "sa-dropdown")

    this.inputSearch = this.createElement("input", "sa-dropdown__input-search")
    this.inputSearch.type = 'text'
    this.inputSearch.placeholder = 'Search'
    this.inputSearch.name = 'search'

    this.optionList = this.createElement('ul', 'sa-dropdown__option-list')

    this.dropdown.append(this.inputSearch, this.optionList)

    this.container.append(this.select, this.dropdown)
    this.mainContainer.append(this.container)

    this.app.parentElement.insertBefore(this.mainContainer, this.app)

    this._initLocalListeners()
  }

  createElement(tag, className) {
    const element = document.createElement(tag)

    Array.isArray(className) ?  element.classList.add(...className) :
      element.classList.add(className)

    return element
  }

  getElement(selector) {
    const element = document.querySelector(selector)

    return element
  }

  render(options) {
    // Remove all options
    while (this.optionList.firstChild) {
      this.optionList.removeChild(this.optionList.firstChild)
    }

    // Render updated version
    for (const option of options) {

      const li = this.createElement("li", "sa-list-li")
      li.dataset.value = option.value

      const label = this.createElement("label", "sa-list-li__label")
      label.htmlFor = option.value
      label.innerText = option.text

      if (option.hasOwnProperty("checked")) {
        const input = this.createElement("input", "sa-list-li__checkbox")
        input.type = "checkbox"
        input.id = option.value
        input.checked = option.checked
        this.app.querySelector(`option[value='${option.value}']`).selected = option.checked
        li.append(input)
      } else {
        label.classList.add("sa-list-li__label--empty")
      }

      li.append(label)

      this.optionList.append(li)
    }
  }

  _initLocalListeners() {
    this.container.addEventListener('click', event => {
      if(event.target.className === "sa-select") {
        this.dropdown.style.display = "block"
        this.inputSearch.focus()

        // Blur to clickout close dropdown
        const blur = this.createElement("div", "sa-blur")
        this.mainContainer.append(blur)

        blur.addEventListener("click", event => {
          this.dropdown.style.display = "none"
          this.mainContainer.removeChild(event.target)
        })
      }
    })

  }

  // Events bind

  bindToggleOption(handler) {
    this.optionList.addEventListener('click', event => {
      if (event.target.type === 'checkbox') {
        const value = event.target.parentElement.dataset.value

        handler(value)
      }
    })
  }

  bindSearchOption(handler) {
    this.inputSearch.addEventListener('input', event => {
      handler(event.target.value)
    })
  }
}

export default View;
