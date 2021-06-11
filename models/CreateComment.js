const mongoose = require('mongoose');
const User = require("./CreateUser");
const Post = require("./CreatePost");
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    PostID: {
        type: Schema.Types.ObjectId,
        ref: Post,
        required: true,
    },
    Description: {
        type: String,
    }
});

const Comment = mongoose.model('comment', schema);
module.exports = Comment;