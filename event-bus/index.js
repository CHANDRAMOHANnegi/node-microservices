const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { eventBusPort, commentsPort, postPort, queryPort, moderationPort } = require("../constants");

const app = express();
app.use(bodyParser.json());


const events = []

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event)

  axios.post(`http://localhost:${postPort}/events`, event).catch((err) => {
    console.log(err.message);
  });
  axios.post(`http://localhost:${commentsPort}/events`, event).catch((err) => {
    console.log(err.message);
  });
  axios.post(`http://localhost:${queryPort}/events`, event).catch((err) => {
    console.log(err.message);
  });
  axios.post(`http://localhost:${moderationPort}/events`, event).catch((err) => {
    console.log(err.message);
  });
  res.send({ status: "OK" });
});

app.get('/events', (req, res) => {
  res.send(events)
})

app.listen(eventBusPort, () => {
  console.log(`Listening on ${eventBusPort}`);
});
