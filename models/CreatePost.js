const mongoose = require('mongoose');
const User = require("./CreateUser");
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    Description: {
        type: String,
    }
});

const Post = mongoose.model('post', schema);
module.exports = Post;