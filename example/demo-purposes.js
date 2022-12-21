window.addEventListener("load", (event) => {
  // Simple multiselect example
  const selectActions1 = new SelectActions({
    select: "#select-0",
  });

  // Example with text translation and customizations setted
  const selectActions = new SelectActions({
    select: "#select-1",
    placeholder: "Clique e selecione",
    txtSelected: "Selecionados",
    txtSelectedSingular: "Selecionado",
    txtAll: "Marcar Todos",
    txtRemove: "Remover",
    txtSearch: "Pesquisar...",
    txtNotFound: "Não encontrado",
    minWidth: "260px",
    maxWidth: "350px",
    showOnlySelectionCount: true,
  });

  // Simple select example
  const selectActions2 = new SelectActions({
    select: "#select-2",
  });

  // Simple select example
  const selectActions3 = new SelectActions({
    select: document.querySelector("#select-3"),
    selectData: [
      { disabled: true, selected: true, label: "Selecione uma cidade" },
      { value: "São Paulo" },
      { value: "João Pessoa" },
      { value: "Recife" },
      { value: "Salvador" },
    ],
  });

  // Simple select example
  const secondarySelect = document.querySelector("#select-5");

  const selectActions4 = new SelectActions({
    select: document.querySelector("#select-4"),
    selectData: [
      { disabled: true, selected: true, label: "Selecione a plataform" },
      { value: "PC" },
      { value: "Mac" },
    ],
    hideX: true,
    callback: async function(mainInstance) {
      mainValue = mainInstance.config.select.value;
      const secondaryOptions = mainValue === "Mac" ? [
          { disabled: true, selected: true, label: "Select an OS for your Mac" },
          { value: "macOS Ventura" },
          { value: "macOS Monterey" },
          { value: "Asahi Linux" }
      ] : [
          { disabled: true, selected: true, label: "Select an OS for you PC" },
          { value: "ArchLinux" },
          { value: "Debian" },
          { value: "Windows 10" },
          { value: "Ubuntu" }
      ];

      /* Example of waiting for data to be loaded from API */

      secondarySelect.innerHTML = "";
      SelectActions.createOptions(
        [{ label: "Loading..." }],
        secondarySelect
      );
      await new Promise(resolve => setTimeout(resolve, 2000));

      /* End of waiting timer example */

      // Emptyng select
      secondarySelect.innerHTML = "";
      // Calling funciton to create options
      SelectActions.createOptions(
        secondaryOptions,
        secondarySelect
      );
    }
  });

  const selectActions5 = new SelectActions({
    select: secondarySelect,
    selectData: [
      { label: "Select value in previous select" },
    ],
    hideX: true,
    observeChanges: true
  });

  /*
    -- For demo purposes --
    Loop bind all selects with updateResult class
  */
  updateResult();

  for (select of document.querySelectorAll("select")) {
    select.addEventListener("change", function () {
      updateResult();
    });
  }
});

/*
  -- For demo purposes --
  This will update result values in example html
*/
function updateResult() {
  const selects = document.querySelectorAll("select");

  for (let i = 0; i < selects.length; i++) {
    const select = [...selects[i].options]
      .filter((option) => option.selected)
      .map((option) => option.value);

    const selected = document.querySelectorAll(".results")[i];
    selected.innerHTML = `[${select.join(", ")}]`;
  }
}
