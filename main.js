/* **************************************

   CanIUse Embed Screenshot

************************************** */

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const takeScreenshot = require("./modules/take-screenshot");
const uploadScreenshot = require("./modules/upload-screenshot");

(() => {
  app.get("/", (req, res) => {
    res.status(200).send("Welcome to our restful API");
  });

  app.post("/upload", (req, res) => {

    if (!req.body) return res.status("400").send("Need request params");
    if (!req.body.feature) return res.status("400").send("Feature required");
    if (!req.body.periods) return res.status("400").send("Periods required");

    const feature = req.body.feature;
    const periods = req.body.periods;
    const accessibleColours = req.body.accessibleColours ? (req.body.accessibleColours == "true") : false;

    takeScreenshot(feature, periods, accessibleColours)
      .then((screenshot) => uploadScreenshot(feature, screenshot))
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.error(err);
        res.status("500").json(err);
      });
  })
})();

const server = app.listen(app.get('port'), function () {
    console.log("app running on port.", server.address().port);
});
