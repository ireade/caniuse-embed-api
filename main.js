/* **************************************

   CanIUse Embed Screenshot

************************************** */

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const takeScreenshot = require("./modules/take-screenshot");
const uploadScreenshot = require("./modules/upload-screenshot");
const screenshotAll = require("./modules/screenshot-all");

const allowedHost = process.env.ALLOWED_HOST;
console.log("Allowed host: ", allowedHost);

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

app.post("/all", (req, res) => {
  console.log("Screenshot All...");
  
  if (req.body.code !== process.env.PASSCODE) return res.status("400").send("Passcode incorrect");

  screenshotAll()
    .then((res) => res.status(200).json(res))
    .catch((err) => {
      console.error(err);
      res.status("500").json(err);
    });
});

const server = app.listen(app.get('port'), function () {
    console.log("app running on port.", server.address().port);
});
