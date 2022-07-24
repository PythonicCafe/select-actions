# JS multiselect

Simple & customizable multi-select picker, written in vanilla JS

## Use

Example of use

```
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
        <script src="multi-select-dropdown.js" type="application/javascript"></script>
        <script type="application/javascript">
            window.addEventListener("load", (event) => {
                const multiSelectDropdown2 = new MultiSelectDropdown({
                    id: "#select-0",
                });
            });
        </script>
    </body>
</html>
```

`index.html` Have some examples 

## Source/Reference

Based on [kiosion.github.io/js-multiselect-dropdown/](https://github.com/kiosion/js-multiselect-dropdown)