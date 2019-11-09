var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

var userschema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false
    }
});

userschema.methods.encryptpassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
};

userschema.methods.validpassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model("User", userschema);