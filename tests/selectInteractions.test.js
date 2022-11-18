describe("Simple select interactions", () => {
  test("Multiselects starts with empty value", async () => {
    // Check if any option is selected
    const results = await page.evaluate(
      () => document.querySelector('input[type="checkbox"]:checked')
    );
    expect(results).toBeNull();
  });

  test("Select first element", async () => {
    await page.click(".multiselect-dropdown");
    await page.click("input[type='checkbox']");

    // Check if selected result is really selected
    let result = await page.evaluate(
      () => document.querySelector('input[type="checkbox"]:checked')
      .parentElement.innerText
    );
    expect(result).toBe('Singapore');

    // Check if selected result is being showed in reults example
    result = await page.evaluate(
      () => document.querySelector(".results").innerText
    );
    expect(result).toBe('[Singapore]');
  });

  test("Select and unselect first element", async () => {
    await page.click(".multiselect-dropdown");
    await page.click("input[type='checkbox']");
    await page.click("input[type='checkbox']");

    // Check if no selections at all
    const results = await page.evaluate(
      () => document.querySelector(".results").innerText
    );
    expect(results).toBe('[]');
  });

  test("Select six options", async () => {
    await page.click(".multiselect-dropdown");

    page.evaluate(() => {
      const dropdown = document.querySelector(".multiselect-dropdown")
      let checkboxes = dropdown.querySelectorAll("input[type='checkbox']");
      checkboxes.forEach(el => {
        el.click();
      })
    })
    // Clickout dropdown
    await page.click("h2");

    // Check if selected result is being showed correct
    const results = await page.evaluate(
      () => document.querySelector(".maxselected").innerText
    );
    expect(results).toBe('9 Selected');
  });

  test("Select all multiselect customized", async () => {
    // Click in the second dropdown
    const dropdown = await page.$$('.multiselect-dropdown');
    await dropdown[1].click();

    // Click select all button
    await page.click(".multiselect-dropdown-all-selector>input[type='checkbox']");

    // Check if selected result is being showed correct
    const results = await page.evaluate(
      () => document.querySelector(".maxselected").innerText
    );
    expect(results).toBe('9 Selecionados');
  });
  test("Unselect all multiselect customized", async () => {
    // Click in the second dropdown
    const dropdown = await page.$$('.multiselect-dropdown');
    await dropdown[1].click();

    const optionPath = ".multiselect-dropdown-all-selector>input[type='checkbox']";

    // Click select all button
    await page.click(optionPath);
    // Click again
    await page.click(optionPath);

    // Check if no selections at all
    const results = await page.evaluate(
      () => document.querySelector(".results").innerText
    );
    expect(results).toBe('[]');
  });

  test("Type in search field, execute a search", async () => {
    await page.click(".multiselect-dropdown");
    // Type a search
    await page.type("input[placeholder='Search field']", 'João Pessoa');
    // Select searched element
    await page.click(".multiselect-dropdown-list>div:not([style*='display: none'])>input[type='checkbox']");

    // Check if selected result is being showed in reults example
    const result = await page.evaluate(
      () => document.querySelector(".results").innerText
    );
    expect(result).toBe('[João Pessoa]');
  });
});
