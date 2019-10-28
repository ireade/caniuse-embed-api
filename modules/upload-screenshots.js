const uploadScreenshot = require("./upload-screenshot");

module.exports = async (screenshots) => {

  const images = [];

  for (let i = 0; i < screenshots.length; i++) {

    const screenshot = screenshots[i];

    try {

      const options = {
        folder: 'caniuse-embed/all',
        public_id: screenshot.feature
      };
      const image = await uploadScreenshot(screenshot.feature, screenshot.screenshot, options);

      console.log(`Screenshot uploaded of ${screenshot.feature}!`);
      
      images.push({
        feature: screenshot.feature,
        url: image.secure_url
      });

    } catch (err) {
      console.error(`Unable to upload screenshot of ${screenshot.feature}`);
    }

  } // end for loop

  return images;

};
