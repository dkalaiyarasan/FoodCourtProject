var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagepath: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    menu: {
        type: Array,
        required: true
    },
    quanity: {
        type: Number,
        required: false
    }
});

var model = mongoose.model("Product", schema);

module.exports = model;