const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const { commentsPort, eventBusPort, commentEvents, moderationPort } = require('../constants');
const { default: axios } = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: "pending" });

  commentsByPostId[req.params.id] = comments;

  await axios.post(`http://localhost:${eventBusPort}/events`, {
    type: commentEvents.CommentCreated,
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending"
    }
  })

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  console.log(`Received Events`, req.body.type);
  const { type, data } = req.body

  if (type == commentEvents.CommentModerated) {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find(comment => comment.id == id);
    comment.status = status;

    await axios.post(`http://localhost:${eventBusPort}/events`, {
      type: commentEvents.CommentUpdated,
      data: {
        id,
        status,
        postId,
        content
      }
    })
  }

  res.send({})
})

app.listen(commentsPort, () => {
  console.log(`Listening on ${commentsPort}`);
});