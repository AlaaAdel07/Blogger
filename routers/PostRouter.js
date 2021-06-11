const express = require("express");
const PostRouter = express.Router();
const authentication = require('../middelware/authontication');
const User = require("../models/CreateUser");
const Post = require("../models/CreatePost");
const Comment = require("../models/CreateComment");

/////////////////////////////base router /api/post+...

PostRouter.post('/', async (req, res) => {
    try {
        const Description = req.body.Description;
        const UserID = req.signedData.id;
        const post = await Post.create({ UserID, Description });
        res.send(post);
    } catch (error) {
        res.statusCode = 422;
        res.send(error);
    }
})

//get Post By ID
PostRouter.get('/:id', async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id }).populate(["UserID"]).exec();
        res.send(post);
    } catch (error) {
        res.statusCode = 422;
        res.send(error);
    }
})

PostRouter.patch('/:id', async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.pid, UserID: req.signedData.id });
        const Description1 = req.body.Description || post.Description;
        const updatedPost = await Post.updateOne({ _id: req.params.id, UserID: req.signedData.id }, {
            $set: {
                Description: Description1,
            }
        });
        res.send(updatedPost)
    } catch (error) {
        res.statusCode = 422;
        res.send(error);
    }
});

PostRouter.delete('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.signedData.id });
        const post = await Post.findOne({ _id: req.params.id, UserID: req.signedData.id });
        if (user.id == post.UserID) {
            const deletePostComments = await Comment.deleteMany({ PostID: req.params.id });
            const deletedPost = await Post.deleteOne({ _id: req.params.id, UserID: req.signedData.id });
            res.send(deletedPost);
        }
        res.send("Can not Delete");
    } catch (error) {
        res.statusCode = 422;
        res.send(error);
    }
})

module.exports = PostRouter;