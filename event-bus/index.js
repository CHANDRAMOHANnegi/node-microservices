const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { eventBusPort, commentsPort, postPort, queryPort } = require("../constants");

const app = express();
app.use(bodyParser.json());

app.post("/events", (req, res) => {
  const event = req.body;

  axios.post(`http://localhost:${postPort}/events`, event).catch((err) => {
    console.log(err.message);
  });
  axios.post(`http://localhost:${commentsPort}/events`, event).catch((err) => {
    console.log(err.message);
  });
  axios.post(`http://localhost:${queryPort}/events`, event).catch((err) => {
    console.log(err.message);
  });
  res.send({ status: "OK" });
});

app.listen(eventBusPort, () => {
  console.log(`Listening on ${eventBusPort}`);
});
