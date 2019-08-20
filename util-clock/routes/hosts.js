var express = require('express');
var router = express.Router();
var auth = require('../policies/auth');


/* GET host page */
router.get('/:id/', function (req, res, next) {
    res.locals.message = req.flash('error');
    res.locals.name = process.env.GARAGE_NAME
    req.app.keys.get('id', req.params.id, function (err, model) {
        if (err) return next(err);
        if ((new Date(model.date)).getTime() > (new Date()).getTime()) {
            var err = new Error('Forbidden');
            err.status = 401;
        }
        res.render('host');
    });
});

module.exports = router;
