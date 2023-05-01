// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

let driver;
let vars;
  async function signIn(email, password) {
    await driver.get("http://localhost:5173");
    await driver.sleep(2000);
    await driver.findElement(By.id("email")).click();
    await driver.findElement(By.id("email")).sendKeys(email);
    await driver.findElement(By.id("password")).click();
    await driver.findElement(By.id("password")).sendKeys(password + Key.RETURN);
    await driver.sleep(2000);
    await driver.switchTo().alert().accept();
  }

// Start of Tests
describe('Add Friend', function() {
  this.timeout(40000);

  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
  })
  afterEach(async function() {
    await driver.quit();
  })
  it('AddFriendSuccess', async function() {
    await signIn("profiletest@uncw.edu", "test1234");
    await driver.get("http://localhost:5173/components/Friends")
    await driver.sleep(2000);
    await driver.findElement(By.id("search")).click()
    await driver.findElement(By.id("search")).sendKeys("nickgaming2")
    await driver.findElement(By.id("search")).sendKeys(Key.ENTER)
    await driver.sleep(2000);
    await driver.findElement(By.css(".MuiButton-root > .MuiSvgIcon-root")).click()
    await driver.sleep(2000);
    await driver.findElement(By.css(".MuiButton-containedSuccess")).click()
    await driver.sleep(2000);
    assert(await driver.switchTo().alert().getText() == "Added nickgaming2")
    await driver.sleep(1000);
    await driver.switchTo().alert().accept();
    await driver.sleep(2000);
    await driver.findElement(By.css(".MuiButton-root > .MuiSvgIcon-root")).click()
    await driver.sleep(1000);
    await driver.findElement(By.css(".MuiButton-containedSuccess > .MuiSvgIcon-root")).click()
    await driver.sleep(2000);
    assert(await driver.switchTo().alert().getText() == "Canceled request to nickgaming2")
    await driver.sleep(1000);
    await driver.switchTo().alert().accept();
    await driver.sleep(2000);
  })
  it('AddFriendCancelRequest', async function() {
    await signIn("profiletest@uncw.edu", "test1234");
    await driver.get("http://localhost:5173/components/Friends")
    await driver.sleep(2000);
    await driver.findElement(By.id("search")).click()
    await driver.findElement(By.id("search")).sendKeys("nickgaming2")
    await driver.findElement(By.id("search")).sendKeys(Key.ENTER)
    await driver.sleep(2000);
    await driver.findElement(By.css(".MuiButton-root > .MuiSvgIcon-root")).click()
    await driver.sleep(1000);
    await driver.findElement(By.css(".MuiButton-containedError > .MuiSvgIcon-root")).click()
    await driver.sleep(1000);
    {
      const elements = await driver.findElements(By.css(".css-j5poh2-MuiButtonBase-root-MuiButton-root"))
      assert(elements.length)
    }
  })
  it('AddFriendSearchFail', async function() {
    await signIn("profiletest@uncw.edu", "test1234");
    await driver.get("http://localhost:5173/components/Friends")
    await driver.sleep(2000);
    await driver.findElement(By.id("search")).click()
    await driver.findElement(By.id("search")).sendKeys("abcdefghijklmnopqrstuvwxyz1234567890!!@@##$$%%^^&&**(())")
    await driver.findElement(By.id("search")).sendKeys(Key.ENTER)
    await driver.sleep(2000);
    assert(await driver.findElement(By.css("h2")).getText() == "No users match this search :(")
  })
  it('AddFriendAcceptAndRemove', async function() {
    await signIn("profiletest@uncw.edu", "test1234");
    await driver.get("http://localhost:5173/components/Friends")
    await driver.sleep(2000);
    await driver.findElement(By.id("search")).click()
    await driver.findElement(By.id("search")).sendKeys("testuser")
    await driver.findElement(By.id("search")).sendKeys(Key.ENTER)
    await driver.sleep(1000);
    await driver.findElement(By.css(".MuiButton-root > .MuiSvgIcon-root")).click()
    await driver.sleep(500);
    await driver.findElement(By.css(".MuiButton-containedSuccess")).click()
    await driver.sleep(1000);
    assert(await driver.switchTo().alert().getText() == "Added testuser", "Failed to add profileuser")
    await driver.sleep(1000);
    await driver.switchTo().alert().accept();
    await driver.sleep(500);
    await driver.findElement(By.css(".MuiIconButton-edgeEnd > .MuiSvgIcon-root")).click()
    await driver.findElement(By.css(".MuiButtonBase-root > .MuiButton-root")).click()
    await driver.sleep(1000);
    await driver.findElement(By.linkText("Go to login")).click()
    await driver.sleep(1000);
    await signIn("testuser@uncw.edu", "test1234");
    await driver.sleep(2000);
    await driver.get("http://localhost:5173/components/Friends/requests")
    await driver.sleep(2000);
    await driver.findElement(By.css(".MuiBadge-root > .MuiButtonBase-root")).click()
    await driver.findElement(By.css(".MuiButton-root:nth-child(1) > .MuiSvgIcon-root")).click()
    await driver.findElement(By.css(".MuiButton-containedSuccess > .MuiSvgIcon-root")).click()
    await driver.sleep(1000);
    assert(await driver.switchTo().alert().getText() == "Added profiletest", "bad alert")
    await driver.sleep(1000);
    await driver.switchTo().alert().accept();
    await driver.sleep(500);    
    await driver.get("http://localhost:5173/components/Friends")
    await driver.sleep(2000);
    await driver.findElement(By.css(".css-u55b5v")).click()
    await driver.sleep(1000);
    await driver.findElement(By.css(".MuiButton-root:nth-child(2)")).click()
    await driver.findElement(By.css(".MuiButton-containedSuccess")).click()
    await driver.findElement(By.css(".MuiButton-root:nth-child(2)")).click()
    await driver.sleep(1000);
    assert(await driver.switchTo().alert().getText() == "Removed profiletest")
    await driver.sleep(1000);
    await driver.switchTo().alert().accept();
    await driver.sleep(500);   
    await driver.findElement(By.css(".css-i9fmh8-MuiBackdrop-root-MuiModal-backdrop")).click()
    await driver.sleep(500);
    assert(await driver.findElement(By.css("h2")).getText() == "No Friends Found :(")
  })
  it('AddFriendAcceptAndRemove', async function() {
    await signIn("profiletest@uncw.edu", "test1234");
    await driver.get("http://localhost:5173/components/Friends")
    await driver.sleep(2000);
    await driver.findElement(By.id("search")).click()
    await driver.findElement(By.id("search")).sendKeys("testuser")
    await driver.findElement(By.id("search")).sendKeys(Key.ENTER)
    await driver.sleep(1000);
    await driver.findElement(By.css(".MuiButton-root > .MuiSvgIcon-root")).click()
    await driver.sleep(500);
    await driver.findElement(By.css(".MuiButton-containedSuccess")).click()
    await driver.sleep(1000);
    assert(await driver.switchTo().alert().getText() == "Added testuser", "Failed to add profileuser")
    await driver.sleep(1000);
    await driver.switchTo().alert().accept();
    await driver.sleep(500);
    await driver.findElement(By.css(".MuiIconButton-edgeEnd > .MuiSvgIcon-root")).click()
    await driver.findElement(By.css(".MuiButtonBase-root > .MuiButton-root")).click()
    await driver.sleep(1000);
    await driver.findElement(By.linkText("Go to login")).click()
    await driver.sleep(1000);
    await signIn("testuser@uncw.edu", "test1234");
    await driver.sleep(2000);
    await driver.get("http://localhost:5173/components/Friends/requests")
    await driver.sleep(2000);
    await driver.findElement(By.css(".MuiBadge-root > .MuiButtonBase-root")).click()
    await driver.sleep(500);
    await driver.findElement(By.css(".MuiButton-root:nth-child(2) > .MuiSvgIcon-root")).click()
    await driver.sleep(1000);
    assert(await driver.switchTo().alert().getText() == "Are you sure you want to decline profiletest's request ?", "bad alert")
    await driver.sleep(1000);
    await driver.switchTo().alert().accept();
    await driver.sleep(1000);
    assert(await driver.switchTo().alert().getText() == "Removed profiletest", "bad alert")
    await driver.sleep(1000);
    await driver.switchTo().alert().accept();
    await driver.sleep(2000);
    assert(await driver.findElement(By.css("div:nth-child(1) > .css-1kgxqm0-MuiTypography-root:nth-child(1)")).getText() == "No Incoming Requests")
  })
})
