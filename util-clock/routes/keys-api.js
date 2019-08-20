var express = require('express');
var router = express.Router();
var auth = require('../policies/auth');

/* GET Keys */
router.get('/', function (req, res, next) {
    res.json(req.app.keys.getAll());
});

/* GET Key */
router.get('/:id', function (req, res, next) {
    req.app.keys.get('id', req.params.id, function (err, model) {
        if (err) return next(err);
        res.json(model);
    });
});

/* POST Key */
router.post('/', auth, function (req, res, next) {
    req.app.keys.post(req.body, function (err) {
        if (err) return next(err);
        res.json({ status: true });
    });
});

/* PUT Key */
router.put('/:id', auth, function(req, res, next) {
    req.app.keys.get('id', req.params.id, function (err, val) {
        if (err) return next(err);
        val.date = req.body.date;            
        req.app.keys.put('id', req.params.id, val, function (err) {
            if (err) return next(err);
            res.json({ status: true });
        });
    });
});


/* DELETE Key */
router.delete('/:id', auth, function (req, res, next) {
    req.app.keys.delete('id', req.params.id, function (err) {
        if (err) return next(err);
        res.json({ status: true });
    });
});

module.exports = router;