var express = require('express');
var router = express.Router();
var auth = require('../policies/auth.js');
var hash = require('password-hash-and-salt');

/* GET Users */
router.get('/', auth, function(req, res, next) {
    req.app.models.users.find().exec(function(err, models) {
        if(err) return next(err);
        models.forEach(function(model){
            delete model.password;
        });
        res.json(models);
    });
});

/* POST User: create a user */
router.post('/', auth, function(req, res, next) {
    req.app.models.users.create(req.body, function(err, model) {
        if(err) return next(err);
        res.json(model);
    });
});

/* GET User */
router.get('/:email', auth, function(req, res, next) {
    req.app.models.users.findOne({ email: req.params.email }, function(err, model) {
        if(err) return next(err);
        if(model === '' || model === null || model === undefined) return next(err);
        delete model.password;
        res.json(model);
    });
});

/* DELETE User */
router.delete('/:email', auth, function(req, res, next) {
    req.app.models.users.destroy({ email: req.params.email }, function(err) {
        if(err) return next(err);
        res.json({ status: true });
    });
});

module.exports = router;
