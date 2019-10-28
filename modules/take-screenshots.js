const puppeteer = require('puppeteer');

module.exports = async (features) => {

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: {
      width: 800,
      height: 500,
      isLandscape: true
    }
  });

  const screenshots = [];

  for (let i = 0; i < features.length; i++) {
    const feature = features[i];

    try {
      const page = await browser.newPage();

      await page.goto(
        `https://caniuse.bitsofco.de/embed/index.html?feat=${feature}&screenshot=true`,
        {
          waitUntil: 'networkidle2'
        }
      );

      const screenshot = await page.screenshot({
        omitBackground: true,
        encoding: 'binary'
      });

      console.log(`Screenshot captured of ${feature}!`);

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
