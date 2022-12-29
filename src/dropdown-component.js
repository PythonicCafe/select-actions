import { newElement } from "./utils";

export default class DropdownComponent {

  static render(div, selectAction, params) {

    div
      .querySelectorAll(".sa-text, span.sa-ph, .sa-simple-del")
      .forEach((el) => div.removeChild(el));

    const selected = Array.from(selectAction.selectedOptions);
    const selectedLength = selected.length;

    if (params.showOnlySelectionCount) {
      const txtAfterCounter =
        selectedLength > 1
          ? params.txtSelected
          : params.txtSelectedSingular;
      div.appendChild(
        newElement("span", {
          class: ["sa-text", "sa-option-text", "sa-maxselected"],
          text: selectedLength + " " + txtAfterCounter,
          title: `${txtAfterCounter}: \n[ ${selected
            .map((option) => option.text)
            .join(", ")} ]`,
        })
      );

    } else {
      selected.map((option) => {
        const classList = ["sa-text"];

        let span = newElement("span", {
          class: classList,
          text: option.text,
          target: option,
        });

        div.appendChild(span);

        if (selectAction.multiple) {
          span.classList.add("sa-option-text");

          if (!params.hideX) {
            span.prepend(
              newElement("span", {
                class: ["sa-del", "sa-option-del"],
                text: "X",
                title: params.txtRemove,
                tabIndex: 0,
                onclick: (event) => {
                  params._removeOpt(span, div, selectAction);
                  event.stopPropagation();
                },
                onkeydown: (event) => {
                  if (event.key === "Enter") {
                    params._removeOpt(span, div, selectAction);
                    e.stopPropagation();
                  }
                },
              })
            );
          }
        } else {
          div.style = "justify-content: space-between; align-items: center";
          if (!option.disabled && !params.hideX) {
            div.append(
              newElement("span", {
                class: ["sa-del", "sa-option-del", "sa-simple-del"],
                text: "X",
                title: params.txtRemove,
                tabIndex: 0,
                onclick: (event) => {
                  params._cleanField(span, div, selectAction);
                  event.stopPropagation();
                },
                onkeydown: (event) => {
                  if (event.key === "Enter") {
                    params._cleanField(span, div, selectAction);
                    e.stopPropagation();
                  }
                },
              })
            );
          }
        }
      });
    }

    if (selectAction.selectedOptions?.length === 0) {
      div.appendChild(
        newElement("span", {
          class: ["sa-ph", "sa-placeholder"],
          text:
            selectAction.attributes?.placeholder?.value ??
            params.placeholder,
        })
      );
    }
  }
}
