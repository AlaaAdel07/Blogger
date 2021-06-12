const express = require('express');
require("./dbConnection");
const app = express();
const port = process.env.PORT || 3000;

var cors = require('cors')
////////to allow any server to send req
app.use(cors());
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin,X-Requested-Width,Content-Type,Accept,authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,POST,PATCH,DELETE,PUT,OPTIONS'
    );
    next();
})

app.use(express.json());
app.use(express.static('public'));

const authentication = require('./middelware/authontication');
const UserRouter = require("./routers/UserRouter")
const PostRouter = require("./routers/PostRouter")
const CommentRouter = require("./routers/CommentRouter")

app.get('/',(eq, res)=>{
    try {
        res.send("Welcome to BlogPost APP");
    } catch (error) {
        res.statusCode = 422;
        res.send(error);
    }
});

app.use((req, res, next) => {
    console.log(`Request Url : ${req.url}, Request method : ${req.method}, Date of Request: ${Date()}`);
    next();
});

app.use("/api/", UserRouter);
app.use("/api/post",authentication,PostRouter);
app.use("/api/comment",authentication,CommentRouter);

app.use( (req, res, next) =>  { //error handler
    res.status(500);
    res.send({error : "server error"});
});


app.listen(port, () => {
    console.log(`Running at port ${port}`);
})

module.exports = app;
