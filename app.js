const { Builder, By, until } = require("selenium-webdriver");

async function searchAndPlayTopCinema() {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.manage().window().maximize();

  try {
    const siteUrl = "https://topcinemaa.one";
    const movieName = "The Odyssey";
    await driver.get(siteUrl);
    await driver.sleep(5000);

    await driver.get(`${siteUrl}/?s=${encodeURIComponent(movieName)}`);
    await driver.sleep(6000);

    let firstMovie = await driver.wait(
      until.elementLocated(
        By.css(".Small--Box a, .Posts--List a, .Block--Item a"),
      ),
      15000,
    );
    let movieLink = await firstMovie.getAttribute("href");
    await driver.get(movieLink);
    await driver.sleep(6000);

    try {
      let watchBtn = await driver.wait(
        until.elementLocated(
          By.css('a.watch, a[href*="/watch"], .Watch--Btn a, .btn-watch'),
        ),
        7000,
      );
      let watchLink = await watchBtn.getAttribute("href");
      if (watchLink) {
        await driver.get(watchLink);
      } else {
        await watchBtn.click();
      }
      await driver.sleep(6000);
    } catch (e) {}

    let mainTab = await driver.getWindowHandle();
    let playerIframe = await driver.wait(
      until.elementLocated(
        By.css(
          ".Watch--Server iframe, .server--embed iframe, iframe[src*='embed'], iframe[allowfullscreen]",
        ),
      ),
      15000,
    );

    await driver.actions().move({ origin: playerIframe }).click().perform();
    await driver.sleep(4000);

    let allTabs = await driver.getAllWindowHandles();
    if (allTabs.length > 1) {
      for (let tab of allTabs) {
        if (tab !== mainTab) {
          await driver.switchTo().window(tab);
          await driver.close();
        }
      }
      await driver.switchTo().window(mainTab);
      await driver.sleep(3000);
      await driver.actions().move({ origin: playerIframe }).click().perform();
    }

    await driver.sleep(3600000);
  } finally {
    await driver.quit();
  }
}

searchAndPlayTopCinema();
