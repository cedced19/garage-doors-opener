var express = require('express');
var router = express.Router();
var authHost = require('../policies/host');
var garageInterface = require('../libs/garage-interface');

/* GET host page */
router.get('/:id/', authHost, function (req, res, next) {
    res.locals.errorMessageHost = req.flash('errorMessageHost');
    res.locals.name = process.env.GARAGE_NAME;
    garageInterface.status(function (err, model) {
        if (err) res.locals.errorMessageHost += '\nUne erreur a eu lieu, lors de la requette.';
        res.locals.status = model;
        res.render('host');
    });
});

router.get('/:id/:interface', authHost, function (req, res, next) {
    garageInterface[req.params.interface](function (err, model) {
        if (err) req.flash('errorMessageHost', 'Une erreur a eu lieu.');
        res.redirect('/hosts/' + req.params.id + '/');
    });
});

module.exports = router;
