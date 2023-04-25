const { url } = require("inspector");
const {By, Key, Builder} = require("selenium-webdriver");
let assert = require('assert');

// Require selenium webdriver
let webdriver = require("selenium-webdriver");
  
// Require webdriver for chrome
// browser called chromedriver
require("chromedriver");

async function test() {
    // Build new window of chrome
    const driver = await new webdriver.Builder().forBrowser("chrome").build();
    
    await driver.get("http://localhost:5173");
    setTimeout(() => {
        driver.findElement(By.id("email")).sendKeys("jbejar2001@uncw.edu");
        driver.findElement(By.id("password")).sendKeys("johnny123", Key.RETURN);
        setTimeout(async () => {
            let alert = driver.switchTo().alert();
            alert.accept();
            const url = await driver.getCurrentUrl();

            assert(url == "https://localhost:5173/components/Forum", "Forum has loaded successfully");
        }, 1000)
    }, 1000)

}

test()