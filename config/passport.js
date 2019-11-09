var passport = require('passport');
var User = require("../models/user");
var LocalStrategy = require("passport-local").Strategy;
const {
    validationResult
} = require('express-validator');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user)
    });
});

passport.use("local.signup", new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, function (req, email, password, done) {
    var errors = validationResult(req).array();
    if (errors.length) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({
        email: email
    }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {
                message: "Email already exists!"
            });
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptpassword(password);
        newUser.firstname = req.body.firstname;
        newUser.lastname = req.body.lastname;
        newUser.location = req.body.location;
        newUser.role = "user";
        newUser.save(function (err, result) {
            if (err) {
                return done(err)
            }
            return done(null, newUser)
        })
    })
}));

passport.use("local.signin", new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, function (req, email, password, done) {
    User.findOne({
        email: email
    }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                message: "No user found!"
            });
        }
        if (!user.validpassword(password)) {
            return done(null, false, {
                message: "Incorrect password!"
            });
        }
        return done(null, user);
    })
}));