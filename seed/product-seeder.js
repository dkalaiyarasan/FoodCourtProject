var mongoose = require('mongoose');
var Product = require("../models/product");
mongoose.connect("mongodb://127.0.0.1:27017/foodapp", {
    useNewUrlParser: true
});

var products = [new Product({
    imagepath: "/images/idly.jpg",
    title: "Idly",
    description: "2 Idlies with sambar and chutney",
    price: "10",
    Quanity: "10",
    menu: ['Breakfast', 'Dinner']
}), new Product({
    imagepath: "/images/dosa.jpg",
    title: "Dosa",
    description: "Plain dosa with sambar and chutney",
    price: "20",
    Quanity: "15",
    menu: ['Breakfast', "Lunch", "Dinner"]
}), new Product({
    imagepath: "/images/chapathi.jpg",
    title: "Chapathi",
    description: "2 chapathi with veg kuruma",
    price: "20",
    Quanity: "20",
    menu: ['Breakfast', 'Lunch', 'Dinner']
}), new Product({
    imagepath: "/images/poori.jpg",
    title: "Poori",
    description: "3 poori with potato masala",
    price: "30",
    Quanity: "10",
    menu: ["Breakfast"]
}), new Product({
    imagepath: "/images/meals.jpg",
    title: "Meals",
    description: "Full meals with rice, sambar, poriyal, rasam, papad and curd",
    price: "50",
    Quanity: "10",
    menu: ["Lunch"]
}), new Product({
    imagepath: "/images/parota.jpg",
    title: "Parota",
    description: "1 parota with veg kuruma",
    price: "10",
    Quanity: "10",
    menu: ["Dinner"]
})];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function (err, result) {
        done++;
        if (done == products.length) {
            exit()
        }
    });
}

function exit() {
    mongoose.disconnect()
}