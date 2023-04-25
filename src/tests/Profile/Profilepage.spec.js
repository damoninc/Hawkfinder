// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('Name?', function() {
  this.timeout(30000)
  let driver
  let vars
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
  })
  afterEach(async function() {
    await driver.quit();
  })
  it('Name?', async function() {
    // Test name: Name?
    // Step # | name | target | value
    // 1 | open | /components/Profile | 
    await driver.get("http://localhost:5173/components/Profile")
    // 2 | setWindowSize | 1440x813 | 
    await driver.manage().window().setRect({ width: 1440, height: 813 })
    // 3 | assertText | css=.profile-name | Damon Incorvaia
    // Should check for full name of user.
    assert(await driver.findElement(By.css(".profile-name")).getText() == "Damon Incorvaia")
    // 4 | assertText | css=.css-tlhf63-MuiTypography-root | Computer Science Student
    // Should check for bio.
    assert(await driver.findElement(By.css(".css-tlhf63-MuiTypography-root")).getText() == "Computer Science Student")
    // 5 | click | css=.MuiTypography-body2 | 
    await driver.findElement(By.css(".MuiTypography-body2")).click()
    // 6 | assertElementPresent | css=.css-1i909wq | 
    // Open modal
    {
      const elements = await driver.findElements(By.css(".css-1i909wq"))
      assert(elements.length)
    }
    // 7 | click | id=:rf: | Michael
    await driver.findElement(By.id(":rf:")).click()
    // 8 | click | css=.MuiButton-textWarning | 
    await driver.findElement(By.css(".MuiButton-textWarning")).click()
    // 9 | mouseOver | css=.MuiTypography-body2 | 
    {
      const element = await driver.findElement(By.css(".MuiTypography-body2"))
      await driver.actions({ bridge: true }).moveToElement(element).perform()
    }
    // 10 | click | css=.MuiTypography-body2 | 
    await driver.findElement(By.css(".MuiTypography-body2")).click()
    // 11 | mouseOut | css=.MuiTypography-body2 | 
    {
      const element = await driver.findElement(By.CSS_SELECTOR, "body")
      await driver.actions({ bridge: true }).moveToElement(element, 0, 0).perform()
    }
    // 12 | click | id=:rr: | Damon
    await driver.findElement(By.id(":rr:")).click()
  })
})
