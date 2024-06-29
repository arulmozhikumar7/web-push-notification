const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "./client")));
app.use(bodyParser.json());

const publicVapidKey =
  "BCLrGGt8gZfeD_FfQO4HnP9oKYB8OpCtNmZwxPyL--RznIuii9TobS3I2Hi5usSC9fUYdWhVmfkUcRVvGm6vH5Y";
const privateVapidKey = "NXAW35mXLCzcQjKrLHAoirqo4T7mzoZswB4IBPgv2Tk";

webpush.setVapidDetails(
  "mailto:example@yourdomain.org",
  publicVapidKey,
  privateVapidKey
);

app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  res.status(201).json({});

  const payload = JSON.stringify({ title: "Push Test" });

  webpush
    .sendNotification(subscription, payload)
    .catch((error) => console.error(error));
});

const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
