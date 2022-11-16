# SelectActions

Simple & customizable multi/single-select picker, written in vanilla JS

## Demo

[https://marcmatias.github.io/select-actions](https://marcmatias.github.io/select-actions)

## Installation

```bash
# yarn or npm
yarn add select-actions
```

Or direct import in HTML

```html
<!-- Add to head HTML tag -->
<link rel="stylesheet" href="/dist/select-actions.min.css" />
<!-- Add to the bottom of body HTML tag -->
<script src="/dist/select-actions.js"></script>

<!-- or directly from unpkg -->
<link
  rel="stylesheet"
  href="https://unpkg.com/select-actions@lastest/dist/select-actions.min.css"
/>
<script src="https://unpkg.com/select-actions@latest/dist/select-actions.min.js"></script>

```

# Run

```js
import SelectActions from "select-actions";

// Only this lines when included with script HTML tag
window.addEventListener("load", (event) => {
    const select-actions = new SelectActions({
        id: "#select-0",
    });
})
```

More examples in `example/index.html`

## References

- [kiosion.github.io/js-multiselect-dropdown/](https://github.com/kiosion/js-multiselect-dropdown)
- [Boostrap select styles](https://getbootstrap.com/docs/5.0/forms/select/)
