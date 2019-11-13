/* **************************************

   CanIUse Embed Screenshot

************************************** */

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const multer = require('multer');
const upload = multer();

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

app.post("/trim", upload.any(), (req, res) => {

  if (!req.files[0]) return res.status("400").send("Image required");
  const image = req.files[0].buffer;

  trimScreenshot(image)
    .then((trimmedImage) => {
      res.status(200).send(trimmedImage).end();
    })
    .catch((err) => {
      console.error(err);
      res.status("500").json(err);
    });
});

const server = app.listen(app.get('port'), function () {
    console.log("app running on port.", server.address().port);
});
