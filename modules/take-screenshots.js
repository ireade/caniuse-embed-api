const puppeteer = require('puppeteer');
const gm = require('gm');
const jimp = require('jimp');

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
    let screenshot;

    try {
      await page.goto(
        `https://caniuse.bitsofco.de/embed/index.html?feat=${feature}&screenshot=true`,
        {
          waitUntil: 'networkidle2'
        }
      );

      screenshot = await page.screenshot({
        omitBackground: true,
        encoding: 'binary'
      });

      console.log(`Screenshot captured of ${feature}!`);

    } catch (err) {
      console.error(`Unable to capture screenshot of ${feature}`);
    } 

    try {
      
      gm(screenshot, 'image.jpg')
      .trim()
      .write('/path/to/out.jpg', (err) => {
        if (err) throw(err);

        console.log('Created an image from a Buffer!');



        screenshots.push({
          feature: feature,
          screenshot: buffer
        });
      });

      

    } catch (err) {
      console.error(`Unable to crop screenshot of ${feature}`);
      console.log(err);
    }
  } // end for loop

  await browser.close();

  return screenshots;
}
