// const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost:27017/blogpost', { useNewUrlParser: true, useUnifiedTopology: true });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error : '));
// db.once('open', function() {
//     console.log("we are connected");
// })
const mongoose = require('mongoose');
require('dotenv').config();

let dbURI;

if (process.env.NODE_ENV ==='test'){
  dbURI = process.env.DBTest || 'mongodb://localhost:27017/blogpostTest'
}
else {
  dbURI = process.env.DBHost || 'mongodb://localhost:27017/blogpost'
}

console.log(process.env.NODE_ENV);

mongoose.connect(dbURI , { useFindAndModify: false }, (err)=>{
    if(err){
      console.error(err);
      process.exit(1);
    }
    console.info('db-connection successfully');
});