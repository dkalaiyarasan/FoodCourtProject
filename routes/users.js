var express = require('express');
var router = express.Router();
var passport = require('passport');
const {
  check
} = require('express-validator');
var csrf = require("csurf");
var csrfprotection = csrf();
var Product = require("../models/product");
var Order = require("../models/order");
var Cart = require('../models/cart');



router.use(csrfprotection);

router.get("/profile", isLoggedIn, function (req, res, next) {
  if (req.user.role == "admin") {
    Product.find(function (err, docs) {
      res.render("user/profile", {
        products: docs,
        csrfToken: req.csrfToken()
      });
    });

  } else {
    Order.find({
      user: req.user
    }, function (err, orders) {
      if (err) {
        return res.write('Error!');
      }
      var cart;
      orders.forEach(function (order) {
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
      });
      res.render("user/profile", {
        csrfToken: req.csrfToken(),
        orders: orders
      });
    });
  }

});

router.get("/logout", isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect("/")
});

router.use("/", notLoggedIn, function (req, res, next) {
  next();
});

router.get("/signup", function (req, res, next) {
  var messages = req.flash("error");
  res.render("user/signup", {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length
  });
});

router.post("/signup", [check('firstname').not().isEmpty().withMessage('First Name is required.'),
  check('lastname').not().isEmpty().withMessage('Last Name is required.'),
  check('email').not().isEmpty().isEmail().withMessage('Invalid E-mail.'),
  check('password').isLength({
    min: 4
  }).withMessage('Invalid password. Minimum 4 characters required.'),
  check('location').not().isEmpty().withMessage('Location is required.')
], passport.authenticate("local.signup", {
  successRedirect: "/user/profile",
  failureRedirect: "/user/signup",
  failureFlash: true
}));

router.get("/signin", function (req, res, next) {
  var messages = req.flash("error");
  res.render("user/signin", {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length
  });
});

router.post("/signin", passport.authenticate("local.signin", {
  successRedirect: "/user/profile",
  failureRedirect: "/user/signin",
  failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.redirect("/")
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  return res.redirect("/")
}