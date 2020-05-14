/* **************************************

   CanIUse Embed Screenshot

************************************** */

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const takeScreenshot = require("./modules/take-screenshot");
const trimScreenshot = require("./modules/trim-screenshot");
const uploadScreenshot = require("./modules/upload-screenshot");
const getFeatureList = require("./modules/get-feature-list");
const formatMDNTitle = require('./modules/format-mdn-feature-title');

const allowedOrigins = process.env.ALLOWED_ORIGINS;
console.log("Allowed origins: ", process.env.ALLOWED_ORIGINS);

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", (req, res) => {
    res.status(200).send("Welcome to the CanIUse Embed API!");
});

app.post("/capture", async (req, res) => {

    const requestOrigin = req.get('origin');
    console.log("Request from:", requestOrigin);

    if (allowedOrigins && !allowedOrigins.includes(requestOrigin)) return res.status("400").json({body: "Unauthorized host"});
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
            public_id: `${feature}-${new Date().getTime()}`
        });
        res.status(200).json(screenshot);
    } catch (err) {
        console.error(err);
        res.status("500").json(err);
    }
});

app.get("/features", async (req, res) => {
    const features = await getFeatureList();
    res.status(200).json(features);
});

app.post("/format-mdn-feature-title", async (req, res) => {

    if (!req.body) return res.status("400").send("Need request params");
    if (!req.body.feature) return res.status("400").send("Feature required");

    try {
        const feature = req.body.feature;
        const path = feature.split('mdn-')[1].split("__");
        const title = await formatMDNTitle(path);
        res.status(200).json({ feature: feature, title: title });
    } catch (err) {
        console.error(err);
        res.status("500").json(err);
    }

});

const server = app.listen(app.get('port'), function () {
    console.log("app running on port.", server.address().port);
});
