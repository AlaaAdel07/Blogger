const express = require("express");
const CommentRouter = express.Router();
const authentication = require('../middelware/authontication');
const User = require("../models/CreateUser");
const Post = require("../models/CreatePost");
const Comment = require("../models/CreateComment");

/////////////////////////////base router /api/post+...

///post id is params
CommentRouter.post('/:pid', async (req, res) => {
    try {
        const Description = req.body.Description;
        const UserID = req.signedData.id;
        const PostID = req.params.pid;
        const comment = await Comment.create({ UserID, PostID, Description });
        res.statusCode = 200;
        res.send(comment);
    } catch (error) {
        res.statusCode = 422;
        res.send(error);
    }
})

//get All post Comment
CommentRouter.get('/:pid', async (req, res) => {
    try {
        const comments = await Comment.find({ PostID: req.params.pid }).populate(["UserID"]).exec();
        res.send(comments);
    } catch (error) {
        res.statusCode = 422;
        res.send(error);
    }
})

CommentRouter.patch('/:pid/:cid', async (req, res) => {
    try {
        const comment = await Comment.findOne({ _id: req.params.cid, PostID: req.params.pid, UserID: req.signedData.id });
        const Description1 = req.body.Description || comment.Description;
        const updatedComment = await Comment.updateOne({ _id: req.params.cid, PostID: req.params.pid, UserID: req.signedData.id }, {
            $set: {
                Description: Description1,
            }
        });
        res.send(updatedComment)
    } catch (error) {
        res.statusCode = 422;
        res.send(error);
    }
});

CommentRouter.delete('/:pid/:cid', async (req, res) => {
    try {
        const comment = await Comment.findOne({ _id: req.params.cid, PostID: req.params.pid });
        if (comment.UserID == req.signedData.id) {
            const deletedPost = await Comment.deleteOne({ _id: req.params.cid, PostID: req.params.pid, UserID: req.signedData.id });
            res.statusCode = 200;
            res.send(deletedPost);
        } else {
            const post = await Post.findOne({ _id: req.params.pid });
            if (comment.UserID == post.UserID) {
                const deletedPost = await Comment.deleteOne({ _id: req.params.cid, PostID: req.params.pid });
                res.statusCode = 200;
                res.send(deletedPost);
            }
        }
        
    } catch (error) {
        res.statusCode = 422;
        res.send(error);
    }
})

module.exports = CommentRouter;