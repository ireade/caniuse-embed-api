const puppeteer = require('puppeteer');
const gm = require('gm').subClass({imageMagick: true});

const trimImage = (image) => {
  return new Promise((resolve, reject) => {

    gm(image, 'image.png')
      .trim()
      .toBuffer('PNG',function (err, buffer) {
        if (err) reject(err);
        resolve(buffer);
      });

  });
};

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

      screenshot = await trimImage(screenshot);

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
