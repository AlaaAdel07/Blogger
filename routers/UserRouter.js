const express = require("express");
const UserRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authentication = require('../middelware/authontication');
const User = require("../models/CreateUser");
const Post = require("../models/CreatePost");
const Comment = require("../models/CreateComment");
//const multer= require("multer");

/////baseRouter /api+....

UserRouter.post('/register', async (req, res, next) => {
    try {
        console.log(req.body);
        const { username, Password } = req.body;
        const hash = await bcrypt.hash(Password, 10);
        const user = await User.create({ username, Password: hash });
        res.statusCode = 201;
        res.send({ message: 'user was registered successfully' });
    } catch (err) {
        console.log(err);
        res.statusCode = 422;
        res.send(err);
        // next();
    }

})

UserRouter.post('/login', async (req, res, next) => {
    try {
        const { username, Password } = req.body;
        const user = await User.findOne({ username }).exec();
        if (!user) throw new Error("wrong user name or password");
        const isMatched = await bcrypt.compare(Password, user.Password);
        if (!isMatched) throw new Error("wrong user name or password");
        const token = await jwt.sign({ id: user.id }, "my-signing-secret");
        res.statusCode = 201;
        res.json({ token });
    } catch (err) {
        res.statusCode = 422;
        res.json({ success: false, message: err.message });
        return;
    }
})

///////Only users Can req to APIs blew
UserRouter.use(authentication)


//user profile
UserRouter.get("/profile", async (req, res, next) => {

    try {
        const userData = await User.findOne({ _id: req.signedData.id });
        const UserPosts = await Post.find({ UserID: req.signedData.id });
        res.json({ userData, UserPosts});
    } catch (error) {
        res.statusCode = 422;
        res.send(error);
    }

})

UserRouter.patch("/profile", async(req, res, next) => {

    try {
        const userData = await User.findOne({ _id: req.signedData.id });

        const username = req.body.username || userData.username;

        if(req.body.password)
        {
            const hash = await bcrypt.hash(Password, 10);
            const userUpdateData = await User.updateOne({ _id: req.signedData.id }, { username,Password: hash });
        }
        else
        {
        const userUpdateData = await User.updateOne({ _id: req.params.id }, { username });
        }
        res.json({ message: "Updated successfully" });

    } catch (error) {
        res.statusCode = 422;
        res.send(error);
    }

})

UserRouter.delete("/profile", async(req, res, next) => {

    try {
        await User.findOneAndRemove({ _id: req.signedData.id });
        await Post.updateMany({ "UserID": req.signedData.id }, { "$pull": { "UserID": req.signedData.id } });
        await Comment.updateMany({ "UserID": req.signedData.id }, { "$pull": { "UserID": req.signedData.id } });
        res.json({ message: "Deleted successfully" });

    } catch (error) {
        res.statusCode = 422;
        res.send(error);
    }

})

////another user profile
UserRouter.get("/profile/:id", async (req, res, next) => {

    try {
        const userData = await User.findOne({ _id: req.params.id });
        const UserPosts = await Post.find({ UserID: req.params.id });
        res.json({ userData, UserPosts});
    } catch (error) {
        res.statusCode = 422;
        res.send(error);
    }

})

module.exports = UserRouter;