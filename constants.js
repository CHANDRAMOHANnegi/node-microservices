module.exports = {
    postPort: 4000,
    commentsPort: 4001,
    queryPort: 4002,
    moderationPort: 4003,
    eventBusPort: 4005,
    commentEvents: {
        CommentModerated: "CommentModerated",
        CommentCreated: "CommentCreated",
        CommentUpdated: "CommentUpdated"
    }
}
