# SelectAction

Simple & customizable multi/single-select picker, written in vanilla JS

## Use

Example of use

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        ...
        <link rel="stylesheet" type="text/css" href="multi-select-dropdown.css" />
    <head>
    <body>
        <select multiple id="#select-0">
            <option value="Option1">Option1</option>
            <option value="Option2">Option2</option>
        </select>
        ...
        <script src="select-actions.js" type="application/javascript"></script>
        <script type="application/javascript">
            window.addEventListener("load", (event) => {
                const select-actions = new MultiSelectDropdown({
                    id: "#select-0",
                });
            });
        </script>
    </body>
</html>
```

`demo/index.html` Have some examples

## References

- [kiosion.github.io/js-multiselect-dropdown/](https://github.com/kiosion/js-multiselect-dropdown)
- [Boostrap select styles](https://getbootstrap.com/docs/5.0/forms/select/)
