/* **************************************

   CanIUse Embed Screenshot

************************************** */

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const trimScreenshot = require("./modules/trim-screenshot");

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

app.post("/trim", (req, res) => {
  console.log(req.get('origin'));
  
  //if (allowedHost && req.get('origin') !== allowedHost) return res.status("400").send("Unauthorized host");
  if (!req.body) return res.status("400").send("Need request params");
  if (!req.body.image) return res.status("400").send("Image required");

  const image = req.body.image;

  trimScreenshot(image)
    .then((buffer) => res.status(200).json({ buffer: buffer }))
    .catch((err) => {
      console.error(err);
      res.status("500").json(err);
    });
});

const server = app.listen(app.get('port'), function () {
    console.log("app running on port.", server.address().port);
});
