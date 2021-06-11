process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


var PostRouter = require('../routers/PostRouter');
const User = require("../models/CreateUser");
const Post = require("../models/CreatePost");

const app = require('../index.js');
var assert = require("assert");

const expect = require('chai');
let chaiHttp = require("chai-http");
let should = expect.should();

expect.use(chaiHttp);

describe("Posts Test", async function () {
    const ID = mongoose.Types.ObjectId();
    const PostID = mongoose.Types.ObjectId();
    before(async () => {
        await Post.deleteMany({});
        await User.deleteMany({});
        await User.create({ _id: ID, username: "Alaa Adel", Password: "123456789" });
        console.log(ID);
    });

    it("Post new Post", (done) => {
        const token = jwt.sign({ id: ID }, "my-signing-secret");
        const post = { _id: PostID, Description: "Test Post Hello" }
        expect.request(app)
            .post("/api/post/")
            .set({ "Authorization": token })
            .send(post)
            .end((err, result) => {
                result.should.have.status(200);
                done();
            });
    });

    it("Get Post", (done) => {
        const token = jwt.sign({ id: ID }, "my-signing-secret");
        expect.request(app)
            .get("/api/post/" + PostID)
            .set({ "Authorization": token })
            .end((err, result) => {
                result.should.have.status(200);
                done();
            });
    });

    it("Update Post", (done) => {
        const token = jwt.sign({ id: ID }, "my-signing-secret");
        const updatedPost = { Description: "updated" };
        expect.request(app)
            .patch("/api/post/" + PostID)
            .set({ "Authorization": token })
            .send(updatedPost)
            .end((err, result) => {
                result.should.have.status(200);
                done();
            });
    });

    it("Delete Post", (done) => {
        const token = jwt.sign({ id: ID }, "my-signing-secret");
        expect.request(app)
            .delete("/api/post/" + PostID)
            .set({ "Authorization": token })
            .end((err, result) => {
                result.should.have.status(422);
                done();
            });
    });


});
