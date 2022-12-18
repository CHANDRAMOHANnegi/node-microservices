const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");

const { moderationPort, eventBusPort, commentEvents } = require("../constants");
const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        await axios.post(`http://localhost:${eventBusPort}/events`, {
            type: commentEvents.CommentModerated,
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }

    res.send({});
})

app.listen(moderationPort, () => {
    console.log(`Listening on ${moderationPort}`);
});
