describe("Simple select interactions", () => {
  test("Multiselects starts with empty value", async () => {
    // Check if any option is selected
    const results = await page.evaluate(
      () => document.querySelector('input[type="checkbox"]:checked')
    );
    expect(results).toBeNull();
  });

  test("Select first element", async () => {
    await page.click(".sa-dropdown");
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
    await page.waitForSelector(".sa-dropdown");
    await page.click(".sa-dropdown");
    await page.click("input[type='checkbox']");
    await page.click("input[type='checkbox']");

    // Check if no selections at all
    const results = await page.evaluate(
      () => document.querySelector(".results").innerText
    );
    expect(results).toBe('[]');
  });

  test("Select nine options", async () => {
    await page.waitForSelector(".sa-dropdown");
    await page.click(".sa-dropdown");

    page.evaluate(() => {
      const dropdown = document.querySelector(".sa-dropdown")
      let checkboxes = dropdown.querySelectorAll("input[type='checkbox']");
      checkboxes.forEach(el => {
        el.click();
      })
    })
    // Clickout dropdown
    await page.click("h2");

    // Check if selected result is being showed correct
    const results = await page.evaluate(
      () => document.querySelectorAll("span")[0].innerText
    );
    expect(results).toBe('9 Selected');
  });

  test("Select all sa customized", async () => {
    // Click in the second dropdown
    await page.waitForSelector(".sa-dropdown");
    let dropdown = await page.$$('.sa-dropdown');
    await dropdown[1].click();

    // Click select all button
    await page.waitForFunction(() => document.querySelector(".sa-all-selector"));
    await page.click(".sa-all-selector");

    // Clickout dropdown
    await page.click("h2");

    // Check if selected result is being showed correct
    const results = await page.evaluate(
      () => document.querySelectorAll("span")[1].innerHTML
    );
    expect(results).toBe('9 Selecionados');
  });

  test("Unselect all sa customized", async () => {
    // Click in the second dropdown
    await page.waitForSelector(".sa-dropdown");
    const dropdown = await page.$$('.sa-dropdown');
    await dropdown[1].click();

    const optionPath = ".sa-all-selector";
    await page.waitForSelector(".sa-dropdown");

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
    await page.waitForSelector(".sa-dropdown");
    await page.click(".sa-dropdown");
    // Type a search
    await page.type("input[placeholder='Search field']", 'João Pessoa');
    // Select searched element
    const selector = ".sa-dropdown-list>div:not([style*='display: none'])>input[type='checkbox']";
    await page.waitForSelector(selector);
    await page.click(selector);

    // Check if selected result is being showed in reults example
    const result = await page.evaluate(
      () => document.querySelector(".results").innerText
    );
    expect(result).toBe('[João Pessoa]');
  });
});
