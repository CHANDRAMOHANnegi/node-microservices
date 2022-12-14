const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId);
});

app.post('/posts/:id/comments', (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    commentsByPostId[id] = {
        id,
        title
    };
    res.status(201).send(commentsByPostId[id]);
});

const commentPort = 4001;

app.listen(commentPort, () => {
    console.log(`Listening on ${commentPort}`);
});
