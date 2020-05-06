var mongoose = require('mongoose');
var passportlocalmong = require("passport-local-mongoose");


var userschema = new mongoose.Schema({
    username: String,
    password: String
});

userschema.plugin(passportlocalmong);
module.exports = mongoose.model("user", userschema);