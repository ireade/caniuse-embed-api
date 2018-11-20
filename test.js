const takeScreenshot = require("./modules/take-screenshot");
const uploadScreenshot = require("./modules/upload-screenshot");

const feature = 'once-event-listener';
const periods = 'future_1,current,past_1,past_2';
const accessibleColours = 'false';

takeScreenshot(feature, periods, accessibleColours)
  .then((screenshot) => uploadScreenshot(feature, screenshot))
  .then((result) => console.log(result))
  .catch((err) => console.log(err));
