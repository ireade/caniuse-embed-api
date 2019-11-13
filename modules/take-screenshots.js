const puppeteer = require('puppeteer');
const trimScreenshot = require('./trim-screenshot');

module.exports = async (features) => {

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: {
      width: 1000,
      height: 750,
      isLandscape: true
    }
  });

  const page = await browser.newPage();

  const screenshots = [];

  for (let i = 0; i < features.length; i++) {
    const feature = features[i];

    try {
      await page.goto(
        `https://caniuse.bitsofco.de/embed/index.html?feat=${feature}&screenshot=true`,
        {
          waitUntil: 'networkidle2'
        }
      );

      let screenshot = await page.screenshot({
        omitBackground: true,
        encoding: 'binary'
      });

      console.log(`Screenshot captured of ${feature}!`);

      screenshot = await trimScreenshot(screenshot);

      console.log(`Screenshot trimmed of ${feature}!`);

      screenshots.push({
        feature: feature,
        screenshot: screenshot
      });

    } catch (err) {
      console.error(`Unable to capture screenshot of ${feature}`);
    } 

  } // end for loop

  await browser.close();

  return screenshots;
}
