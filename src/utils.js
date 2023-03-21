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

export function trapFocus(element) {
  var focusableEls = element.querySelectorAll(
    `a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]):not([tabindex='-1']), select:not([disabled]), label`,
  );
  var firstFocusableEl = focusableEls[0];
  var lastFocusableEl = focusableEls[focusableEls.length - 1];
  var KEYCODE_TAB = 9;

  element.addEventListener('keydown', function (e) {
    var isTabPressed = e.key === 'Tab' || e.keyCode === KEYCODE_TAB;

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) {
      /* shift + tab */ if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        e.preventDefault();
      }
    } /* tab */ else {
      if (document.activeElement === lastFocusableEl) {
        firstFocusableEl.focus();
        e.preventDefault();
      }
    }
  });
}
