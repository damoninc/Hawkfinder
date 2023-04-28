/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
// Require selenium webdriver
let webdriver = require("selenium-webdriver");
const assert = require("assert");

async function logging_in() {
  // Require webdriver for chrome
  // browser called chromedriver
  require("chromedriver");
  // require("geckodriver");

  // Build new window of chrome
  let driver = new webdriver.Builder().forBrowser("chrome").build();

  // Open geeksforgeeks using get method
  await driver.get("http://localhost:5173");
  setTimeout(async () => {
    await driver
      .findElement(webdriver.By.id("email"))
      .sendKeys("og2828@uncw.edu");
    await driver
      .findElement(webdriver.By.id("password"))
      .sendKeys("12345678", webdriver.Key.ENTER);
    console.log("We here and haven't found SHIT!");
    setTimeout(async () => {
      await driver.wait(webdriver.until.alertIsPresent());
      let alert = await driver.switchTo().alert();
      let alertText = await alert.getText();
      setTimeout;
      await alert.accept();
      console.log(alertText);
      assert(
        alertText == "Signed in as Octavio Galindo",
        "Not signed in as the right user!"
      );
      await driver.switchTo().alert().accept();
    }, 2000);
  }, 2000);
  driver.quit();
}

logging_in();
