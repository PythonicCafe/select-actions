
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
  const list = Array.prototype.filter.call(universe, function(item) {return item.tabIndex >= "0"});
  const index = list.indexOf(el);
  const resultIndex = next ? index + 1 : index - 1;

  if (resultIndex === -1) {
    // Jump to last element if out of start o list
    return list[list.length -1];
  } else if (resultIndex < list.length) {
    return list[resultIndex]
  }

  // Jump to first element if out of end of list
  return list[0]
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

  return bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
}
