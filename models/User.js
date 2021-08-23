const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    emailID: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    followers: [ ],
    following: [ ],
    posts: [ ],
});

module.exports = mongoose.model('Users', UserSchema);