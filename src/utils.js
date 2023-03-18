export function createElement(tag, className) {
  const element = document.createElement(tag);
  Array.isArray(className) ? element.classList.add(...className) : element.classList.add(className);
  return element;
}

export function convertStringToHTML(str) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  return doc.body.firstChild;
}
