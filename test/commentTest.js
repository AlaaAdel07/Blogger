process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


var CommentRouter = require('../routers/CommentRouter');
const User = require("../models/CreateUser");
const Post = require("../models/CreatePost");
const Comment = require("../models/CreateComment");

const app = require('../index.js');
var assert = require("assert");

const expect = require('chai');
let chaiHttp = require("chai-http");
let should = expect.should();

expect.use(chaiHttp);

describe("Comment Test", async function () {
    const ID = mongoose.Types.ObjectId();
    const PostID1 = mongoose.Types.ObjectId();
    const CommentID = mongoose.Types.ObjectId();
    before(async () => {
        await Post.deleteMany({});
        await User.deleteMany({});
        await Comment.deleteMany({});
        await User.create({ _id: ID, username: "Alaa Adel", Password: "123456789" });
        await Post.create({ _id: PostID1, Description: "New Post", UserID: ID });
    });

    it("Post new Comment", (done) => {
        const token = jwt.sign({ id: ID }, "my-signing-secret");
        const comment = { _id: CommentID, UserID: ID, PostID: PostID1, Description: "Test Comment Hello" }
        expect.request(app)
            .post("/api/comment/" + PostID1)
            .set({ "Authorization": token })
            .send(comment)
            .end((err, result) => {
                result.should.have.status(200);
                done();
            });
    });

    it("Get All Post Comment", (done) => {
        const token = jwt.sign({ id: ID }, "my-signing-secret");
        expect.request(app)
            .get("/api/comment/" + PostID1)
            .set({ "Authorization": token })
            .end((err, result) => {
                result.should.have.status(200);
                done();
            });
    });

    it("Update Comment", (done) => {
        const token = jwt.sign({ id: ID }, "my-signing-secret");
        const updatedComment = { Description: "updated" };
        expect.request(app)
            .patch("/api/comment/" + PostID1 + "/" + CommentID)
            .set({ "Authorization": token })
            .send(updatedComment)
            .end((err, result) => {
                result.should.have.status(200);
                done();
            });
    });

    it("Delete Comment", (done) => {
        const token = jwt.sign({ id: ID }, "my-signing-secret");
        expect.request(app)
            .delete("/api/comment/" + PostID1 + "/" + CommentID)
            .set({ "Authorization": token })
            .end((err, result) => {
                result.should.have.status(422);
                done();
            });
    });


});
