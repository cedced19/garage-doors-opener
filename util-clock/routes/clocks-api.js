var express = require('express');
var router = express.Router();
var auth = require('../policies/auth.js');
var suncalc = require('suncalc');


/* GET clocks infos */
router.get('/', auth, function (req, res) {
    var date = new Date();
    var sunset = suncalc.getTimes(date, process.env.COORDS_LAT, process.env.COORDS_LNG).sunset;
    if (sunset.getTime() < (new Date()).getTime()) {
        date.setDate(date.getDate() + 1);
        sunset = suncalc.getTimes(date, process.env.COORDS_LAT, process.env.COORDS_LNG).sunset;
    }
    res.json({ clocks: req.app.clocks.getAll(), sunset: sunset });
});


/* PUT toggle system */
router.put('/toggle', auth, function(req, res, next) {
    if (req.body.toggle == !req.app.clocks.get('up')) {
        res.json({changed: false, up: req.body.up});
    } else {
        req.app.clocks.put('up', !req.app.clocks.get('up'), function(err, model) {
            if(err) return next(err);
            // Stop or start event there
            res.json({changed: true, up: req.body.up});
        });
    }
});


/* PUT update clock */
router.put('/:name', auth, function(req, res, next) {
    req.app.clocks.put(req.params.name, req.body, function(err, model) {
        if(err) return next(err);
        // Update event there
        res.json(model);
    });
});

module.exports = router;