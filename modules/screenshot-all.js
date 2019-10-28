const fetch = require('node-fetch');
const uploadScreenshot = require("./upload-screenshot");
const takeScreenshots = require("./take-screenshots");

const url = process.env.CANIUSE_DATA_URL || 'https://raw.githubusercontent.com/Fyrd/caniuse/master/fulldata-json/data-2.0.json';

module.exports = () => {
  return fetch(url)
    .then((res) => res.json())
    .then(async (res) => {

        const featuresArray = Object.keys(res.data);
        const featuresToCapture = featuresArray;

        const screenshots = await takeScreenshots(featuresToCapture);

        const result = {
          features: featuresToCapture,
          success: [],
          errors: []
        };

        for (let i = 0; i < screenshots.length; i++) {

          const screenshot = screenshots[i];

          try {
            const options = {
              folder: 'caniuse-embed/all',
              public_id: screenshot.feature
            };
            const image = await uploadScreenshot(screenshot.feature, screenshot.screenshot, options);
            result.success.push({
              feature: screenshot.feature,
              image: image.secure_url
            });
          } catch (err) {
            result.errors.push({
              feature: screenshot.feature,
              error: err
            });
          }

        } // end for loop

        console.log('FINAL LOG');
        console.log('********************');
        console.log(`${result.features.length} features attempted to capture`);
        console.log(`${result.success.length} features successfully captured`);
        console.log(`${result.errors.length} features unable to capture`);
        console.log('');
        result.success.forEach((feature) => {
          console.log(feature.image);
        });

        return result;
    });
};
