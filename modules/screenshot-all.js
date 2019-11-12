const fetch = require('node-fetch');
const uploadScreenshots = require("./upload-screenshots");
const takeScreenshots = require("./take-screenshots");

const url = process.env.CANIUSE_DATA_URL || 'https://raw.githubusercontent.com/Fyrd/caniuse/master/fulldata-json/data-2.0.json';

fetch(url)
  .then((res) => res.json())
  .then(async (res) => {

    let features = Object.keys(res.data);
    // features = features.slice(0, 20); // @testing

    // Divide features into chunks to capture screenshot
    const chunkSize = 10;
    const featuresChunks = [];
    for (let i = 0; i < features.length; i += chunkSize) {
      featuresChunks.push( features.slice(i, i + chunkSize) )
    }

    let screenshots = [];
    for (let i = 0; i < featuresChunks.length; i++) {
      const newScreenshots = await takeScreenshots(featuresChunks[i]);
      screenshots = screenshots.concat(newScreenshots);
    }

    const images = await uploadScreenshots(screenshots);
    
    console.log('********************');
    console.log('* FINAL LOG        *');
    console.log('********************');
    console.log(`${features.length} features attempted to capture and upload`);
    console.log(`${screenshots.length} features successfully captured`);
    console.log(`${images.length} features successfully uploaded`);
    console.log(`${features.length - images.length} errors`);
    console.log('');
    images.forEach((image) => {
      console.log(image.url);
    });
    console.log('********************');

  });
