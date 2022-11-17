window.addEventListener("load", (event) => {

  // Simple example
  const selectActions1 = new SelectActions({
    id: "#select-0",
  });

  // Example with text translation and customizations setted
  const selectActions = new SelectActions({
    id: "#select-1",
    placeholder: "Clique e selecione",
    txtSelected: "Selecionados",
    txtSelectedSingular: "Selecionado",
    txtAll: "Marcar Todos",
    txtRemove: "Remover",
    txtSearch: "Pesquisar...",
    txtNotFound: "Não encontrado",
    minWidth: "260px",
    maxWidth: "350px",
    selectAll: true,
    showOnlySelectionCount: true,
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
