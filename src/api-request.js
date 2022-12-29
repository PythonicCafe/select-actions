import {
  newElement,
} from "./utils";

export default class ApiRequest {
  #url;

  constructor(url) {
    this.#url = url;
  }

  async queryApi(search) {
    let response;

    if(search) {
      response = await fetch(this.#url + "/search?query", {
        method: "POST",
        headers: { "Content-type": "application/json;charset=UTF-8" },
        body: JSON.stringify({
          query: {
            query_string: {
              fields: ["title"],
              query: search
            }
          }
        })
      });
    } else {
      response = await fetch(this.#url);
    }

    const json = await response.json();
    return json;
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
  async createOptions(elToAppend, divElement = false, search) {
    const self = this;
    const listOfValues = await this.queryApi(search);
    elToAppend.innerHTML = "";

    elToAppend.appendChild(
      self.createOptElement({
        disabled: true,
        selected: true,
        content: "Select a title",
        tabIndex: -1,
        divElement
      })
    );

    for (const opt of listOfValues.data) {
      const option = self.createOptElement({
        id: opt.id ? opt.id : "",
        disabled: opt.disabled ? opt.disabled : false,
        selected: opt.selected ? opt.selected : false,
        content: opt.title ? opt.title : opt.value,
        divElement
      })

      elToAppend.appendChild(option);
    }
  }

  createOptElement(params = {}) {
    if (params.divElement) {
      const optionElement = newElement("div", {
        id: params.id ? params.id : "",
        class: params.disabled
        ? ["sa-option", "sa-unsearchable", "sa-disabled-option"]
        : "sa-option",
        disabled: params.disabled ? params.disabled : false,
        selected: params.selected ? params.selected : false,
        tabIndex: params.tabIndex ? params.tabIndex : 0,
      });

      optionElement.appendChild(newElement("label", { text: params.content }));

      optionElement.innerHTML = params.content;

      return optionElement;
    }

    const optionElement = newElement("option", {
      classList: "sa-option",
      value: params.id ? params.id : "",
      disabled: params.disabled ? params.disabled : false,
      selected: params.selected ? params.selected : false,
      tabIndex: params.tabIndex ? params.tabIndex : 0,
    });

    optionElement.innerHTML = params.content;

    return optionElement;
  }
}
