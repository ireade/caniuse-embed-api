/* **************************************

   CanIUse Embed Screenshot

************************************** */

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const takeScreenshot = require("./modules/take-screenshot");
const trimScreenshot = require("./modules/trim-screenshot");
const uploadScreenshot = require("./modules/upload-screenshot");

const allowedHost = process.env.ALLOWED_HOST;
console.log("Allowed host: ", process.env.ALLOWED_HOST);

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome to our restful API");
});

app.post("/capture", async (req, res) => {

  console.log("Request from: ", req.get('host'));
  
  if (allowedHost && req.get('host') !== allowedHost) return res.status("400").send("Unauthorized host");
  if (!req.body) return res.status("400").send("Need request params");
  if (!req.body.feature) return res.status("400").send("Feature required");

  const feature = req.body.feature;
  const periods = req.body.periods;
  const accessibleColours = req.body.accessibleColours === "true";

  console.log(feature);
  console.log(periods);
  console.log(accessibleColours);

  try {
    let screenshot = await takeScreenshot(feature, periods, accessibleColours);
    screenshot = await trimScreenshot(screenshot);
    screenshot = await uploadScreenshot(feature, screenshot, {
			folder: 'caniuse-embed/static',
			public_id: `test-${feature}-${new Date().getTime()}`
		});
    res.status(200).json(screenshot);
  } catch (err) {
    console.error(err);
    res.status("500").json(err);
  }
});

const server = app.listen(app.get('port'), function () {
    console.log("app running on port.", server.address().port);
});
