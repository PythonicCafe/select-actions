/**
 * Creates and appends new option elements to a given element.
 *
 * @param {Array} listOfValues - An array of objects containing option values and labels.
 * @param {HTMLElement} elToAppend - The element (a select) to which the new option elements
 * will be appended.
 *
 * @return {undefined}
 */
export function createOptions(listOfValues, elToAppend) {
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
 * Finds the next or previous tab element in a given container element.
 *
 * @param {HTMLElement} elContainer - The container element to search for tab elements.
 * @param {string} selectable - A HTML or CSS class selector string that defines the tab elements to search for.
 * @param {HTMLElement} el - The current tab element.
 * @param {boolean} [next=true] - Determines whether to search for the next or previous tab element.
 *
 * @returns {HTMLElement|null} The next or previous tab element, or null if not found.
 */
export function findTab(elContainer, selectable, el, next = true) {
  const universe = elContainer.querySelectorAll(selectable);
  const list = Array.prototype.filter.call(universe, function (item) {
    return item.tabIndex >= "0";
  });
  const index = list.indexOf(el);
  const resultIndex = next ? index + 1 : index - 1;

  if (resultIndex === -1) {
    // Jump to last element if out of start o list
    return list[list.length - 1];
  } else if (resultIndex < list.length) {
    return list[resultIndex];
  }

  // Jump to first element if out of end of list
  return list[0];
}

/**
 * Determines whether an element is outside the bottom viewport.
 *
 * @param {Element} el - The element to be checked.
 *
 * @returns {boolean} A boolean indicating whether the element is outside the viewport.
 */
export function isOutOfBottomViewport(el) {
  const bounding = el.getBoundingClientRect();

  return (
    bounding.bottom >
    (window.innerHeight || document.documentElement.clientHeight)
  );
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
export function newElement(tag, params) {
  let el = document.createElement(tag);
  if (params) {
    Object.keys(params).forEach((key) => {
      if (key === "class") {
        Array.isArray(params[key])
          ? params[key].forEach((o) => (o !== "" ? el.classList.add(o) : 0))
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
 * Make a deep copy of the given object
 * This function creates a new object with the same properties and values
 * as the original object, including arrays and nested objects
 *
 * @param { any } obj An object to be copied
 * @returns { object } A copy of the sended object
 */
export function deepCopy(obj) {
  const copy = {};

  // Iterate over the properties of the original object
  for (const key in obj) {
    // Only copy own properties, not inherited properties
    if (obj.hasOwnProperty(key)) {
      const val = obj[key];

      // If the property is an array, copy the array
      if (Array.isArray(val)) {
        copy[key] = val.concat();
      }
      // If the property is an object, create a deep copy of the object
      else if (typeof val === "object" && val !== null) {
        copy[key] = deepCopy(val);
      }
      // Else the property is not an array or object, copy the value
      else {
        copy[key] = val;
      }
    }
  }

  return copy;
}

/**
 * The `mergeObjects` function takes in two objects, `opts1` and `opts2`,
 * and creates a new object by making a deep copy of `opts1`.
 * It then iterates over the properties of `opts2` and merges them with
 * the corresponding properties in the new object.
 *
 * @param {object} opts1 - The first object to merge
 * @param {object} opts2 - The second object to merge
 * @returns {object} - The merged object
 */
export function mergeObjects(opts1, opts2) {
  // Create a new object by making a deep copy of opts1
  let merged = deepCopy(opts1);

  // Iterate over the properties of opts2
  for (const key of Object.keys(opts2)) {
    let newValue = opts2[key],
      oldValue = merged[key];

    // If the property is an array, concatenate the arrays
    if (Array.isArray(newValue) && Array.isArray(oldValue)) {
      merged[key] = newValue.concat(...oldValue);
    }
    // If the property is an object, merge the objects
    else if (
      newValue !== null &&
      typeof newValue == "object" &&
      oldValue !== null &&
      typeof oldValue == "object"
    ) {
      merged[key] = mergeObjects(oldValue, newValue);
    }
    // Otherwise, use the value from opts2
    else {
      merged[key] = newValue;
    }
  }

  return merged;
}
