describe("Simple select interactions", () => {

  test("Test simple sa select", async () => {
    // Click in the second dropdown
    await page.waitForSelector(".sa-dropdown");
    const dropdown = await page.$$('.sa-dropdown');
    await dropdown[2].click();

    // Type a search
    await page.type("input[placeholder='Search field']", 'João Pessoa');

    // Select searched element
    const selector = '.sa-option[style="display: flex;"]';
    await page.waitForSelector(selector);
    await page.click(selector);

    // Check if selected result is being showed in reults example
    const result = await page.evaluate(
      () => document.querySelectorAll(".results")[2].innerText
    );
    expect(result).toBe('[João Pessoa]');

  });

  test("Test simple sa click to clean field", async () => {
    // Click in the second dropdown
    await page.waitForSelector(".sa-dropdown");
    const dropdown = await page.$$('.sa-dropdown');
    await dropdown[2].click();

    // Type a search
    await page.type("input[placeholder='Search field']", 'João Pessoa');

    // Select searched element
    let selector = '.sa-option[style="display: flex;"]';
    await page.waitForSelector(selector);
    await page.click(selector);

    // Click in empty field simple select
    selector = '.sa-simple-del';
    await page.waitForSelector(selector);
    await page.click(selector);

    // Check if selected result is being showed empty
    const result = await page.evaluate(
      () => document.querySelectorAll(".results")[2].innerText
    );
    expect(result).toBe('[]');
  });


  test("Test simple sa select array of data populated", async () => {
    // Click in the second dropdown
    await page.waitForSelector(".sa-dropdown");
    const dropdown = await page.$$('.sa-dropdown');
    await dropdown[5].click();

    // Type a search
    await page.type("input[placeholder='Search field']", 'Recife');

    // Select searched element
    const selector = '.sa-option[style="display: flex;"]';
    await page.waitForSelector(selector);
    await page.click(selector);

    // Check if selected result is being showed in reults example
    const result = await page.evaluate(
      () => document.querySelectorAll(".results")[5].innerText
    );
    expect(result).toBe('[Recife]');

  });
});
