var express = require('express');
var router = express.Router();
var Product = require("../models/product");
var Cart = require("../models/cart");
var Order = require("../models/order");

/* GET home page. */
router.get('/', function (req, res, next) {
  var successMsg = req.flash("success");
  Product.find(function (err, docs) {
    var productchunk = [],
      chunksize = 3;
    for (var i = 0; i < docs.length; i += chunksize) {
      productchunk.push(docs.slice(i, i + chunksize))
    }


    res.render('shop/index', {
      products: productchunk,
      successMsg: successMsg,
      nomessage: !successMsg
    });
  });
});

router.get("/add-to-cart/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect("/");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect("/")
  })
});

router.get("/cart", function (req, res, next) {
  if (!req.session.cart) {
    return res.render("shop/cart", {
      products: null
    })
  }
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  res.render("shop/cart", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  });
});

router.get("/cart/remove/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.remove(productId);
  req.session.cart = cart;
  res.redirect("/cart");
});

router.post("/cart/update/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var qty = parseInt(req.body.updatedqty);
  if (qty > 0) {
    cart.update(productId, qty);
    req.session.cart = cart;
  }
  res.redirect("/cart");
});

router.get("/checkout", function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/")
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render("shop/checkout", {
    totalPrice: cart.totalPrice,
    errMsg: errMsg,
    noError: !errMsg
  });
});

router.post("/checkout", function (req, res, next) {
  var cart = new Cart(req.session.cart);

  const stripe = require('stripe')('sk_test_4bQILtVvigNsK73yVaFPTc26007W5QeIP9');
  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: 'usd',
    source: req.body.stripeToken,
    receipt_email: 'dkalaiyarasan1997@gmail.com',
    description: "Test charge"
  }, function (err, charge) {
    if (err) {
      req.flash('error', err.message)
      return res.redirect('/checkout');
    }

    var order = new Order({
      cart: cart,
      user: req.user,
      paymentId: charge.id,
      date: new Date()
    });


    order.save(function (err, response) {
      req.flash('success', 'successfully bought a product');
      req.session.cart = null;
      res.redirect('/');
      var count = 0;
      var cartLength = Object.keys(cart.items).length;
      for (const key in cart.items) {
        if (cart.items.hasOwnProperty(key)) {
          const element = cart.items[key];
          Product.findById(key, function (err, doc) {
            var qty = doc.quantity;
            var newqty = qty - element.qty;
            if (newqty >= 0) {
              Product.update({
                _id: key
              }, {
                quantity: newqty
              }, function (err, raw) {
                count++;
                if (count == cartLength) {
                  req.session.cart = null;
                  res.redirect("/orders");
                }
              });
            }
          });
        }
      }
    });
  });
});

router.get("/orders", function (req, res, next) {
  Order.find(function (err, orders) {
    res.render("shop/orders", {
      orders: orders
    });
  });
});

router.post("/update", function (req, res, next) {
  var updatedObj = {
    title: req.body.title,
    imagepath: req.body.imagepath,
    description: req.body.description,
    price: parseInt(req.body.price),
    quantity: parseInt(req.body.quantity),
  };
  req.flash("success", "Successfully placed an order.");
  Product.updateOne({
    _id: req.body.id
  }, updatedObj, function (err, raw) {
    res.send({
      success: "Admin updated stock."
    });
  });

})

module.exports = router;