var express = require('express');
var passport = require('passport');
var router = express.Router();
var auth = require('../policies/auth');


/* GET admin page */
router.get('/', function (req, res, next) {
    if (req.app.get('configurated')) {
        if (!req.isAuthenticated()) {
            res.redirect('/login');
        } else {
            res.render('admin');
        }
    } else {
        req.app.models.users.find().exec(function (err, models) {
            if (err) return next(err);
            if (models.length == 0) {
                res.redirect('/users/new');
            } else if (!req.isAuthenticated()) {
                res.redirect('/login');
            } else {
                res.render('admin');
            }
        });
    }
});

/* GET login page */
router.get('/login', function (req, res) {
    res.locals.message = req.flash('error');
    res.render('login');
});

/* POST login */
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), function (req, res) {
    res.redirect('/');
});

/* GET logout */
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

/* GET users: get all users */
router.get('/users', auth, function (req, res) {
    req.app.models.users.find().exec(function (err, models) {
        if (err) return next(err);
        res.locals.users = models;
        res.render('users-list');
    });
});

/* GET new user: create new account */
router.get('/users/new', auth, function (req, res) {
    req.app.models.users.find().exec(function (err, models) {
        if (err) return next(err);
        res.locals.connected = (models.length == 0);
        res.render('new-account');
    });
});

/* GET delete user: delete an user */
router.get('/users/delete/:email', auth, function (req, res) {
    if (req.user.email == req.params.email) {
        res.locals.success = 'user-not-deleted';
        res.render('success-page');
    } else {
        req.app.models.users.destroy({ email: req.params.email }, function (err) {
            if (err) return next(err);
            res.locals.success = 'user-deleted';
            res.render('success-page');
        });
    }
});

/* POST new user: save new user */
router.post('/users/new/', auth, function (req, res, next) {
    req.app.models.users.create(req.body, function (err, model) {
        if (err) return next(err);
        res.locals.success = 'user-saved';
        res.render('success-page');
    });
});

/* GET update user: show page to update an user */
router.get('/users/update/:email', auth, function (req, res) {
    req.app.models.users.findOne({ email: req.params.email }, function (err, model) {
        if (err) return next(err);
        if (model === '' || model === null || model === undefined) return next(err);
        res.locals.email = model.email;
        res.locals.error = false;
        res.render('update-user');
    });
});

/* POST update user: update an user in database */
router.post('/users/update/:email', auth, function (req, res) {
    if (req.body.confirm == req.body.password) {
        req.app.models.users.update({ email: req.params.email }, {
            email: req.body.email,
            password: req.body.password
        }, function (err, model) {
            if (err) return next(err);
            res.locals.success = 'user-updated';
            res.render('success-page');
        });
    } else {
        res.locals.email = req.params.email;
        res.locals.error = true;
        res.render('update-user');
    }

});

module.exports = router;
