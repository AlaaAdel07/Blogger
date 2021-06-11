process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


var UserRouter = require('../routers/UserRouter');
const User = require("../models/CreateUser");
const Post = require("../models/CreatePost");

const app = require('../index.js');
var assert = require("assert");

const expect = require('chai');
let chaiHttp = require("chai-http");
let should = expect.should();

expect.use(chaiHttp);

describe("Post User Registeration", async function () {

  before(() => User.deleteMany({}));

  const ID = mongoose.Types.ObjectId();

  //////Note Username is unique 
  it("Add New User", (done) => {
    const newuser = { _id: ID, username: "Alaa Adel", Password: "123456789" };
    expect.request(app)
      .post("/api/register/")
      .send(newuser)
      .end((err, result) => {
        result.should.have.status(201);
        done();
      });
  });

  it("Add New User With same username", (done) => {
    const newuser = { _id: ID, username: "Alaa Adel", Password: "123456789" };
    expect.request(app)
      .post("/api/register/")
      .send(newuser)
      .end((err, result) => {
        result.should.have.status(422);
        done();
      });
  });

  it("Login", (done) => {
    const user = { username: "Alaa Adel", Password: "123456789" };
    expect.request(app)
      .post("/api/login/")
      .send(user)
      .end((err, result) => {
        result.should.have.status(201);
        result.body.token.should.be.a('string');
        //token=result.body.token;
        done();
      });
  });

  it("Get Profile", (done) => {
    const token = jwt.sign({ id: ID }, "my-signing-secret");
    expect.request(app)
      .get("/api/profile/")
      .set({ "Authorization": token })
      .end((err, result) => {
        result.should.have.status(200);
        done();
      });
  });

  it("Prevent open profile without login", (done) => {
    expect.request(app)
      .get("/api/profile/")
      .end((err, result) => {
        result.should.have.status(401);
        done();
      });
  });

});
