const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        unique: true
    },
    Password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('user', schema);
module.exports = User;