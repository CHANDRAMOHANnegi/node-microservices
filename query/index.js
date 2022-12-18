const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
const { eventBusPort, commentsPort, postPort, queryPort, commentEvents } = require("../constants");
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvents = (type, data) => {
    if (type === 'PostCreated') {
        const { id, title } = data;

        posts[id] = { id, title, comments: [] };
    }

    if (type === commentEvents.CommentCreated) {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        post?.comments.push({ id, content, status });
    }

    if (type == commentEvents.CommentUpdated) {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => comment.id == id);
        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvents(type, data)

    console.log(posts);
    res.send({});
});

app.listen(queryPort, async () => {
    console.log(`Listening on ${queryPort}`);

    const { data } = await axios.get(`http://localhost:${eventBusPort}/events`)

    for (const event of data) {
        console.log('Processing events:', event.type);
        handleEvents(event.type, event.data)
    }

});
