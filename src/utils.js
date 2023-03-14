export function createElement(tag, className) {
  const element = document.createElement(tag);

  Array.isArray(className)
    ? element.classList.add(...className)
    : element.classList.add(className);

  return element;
}

export function getElement(selector) {
  const element = document.querySelector(selector);

  return element;
}
