var express = require('express');
var router = express.Router();
var auth = require('../policies/auth');
var suncalc = require('suncalc');
var cronTasksManager = require('../libs/cron-tasks-manager');
var schedule = require('node-schedule');

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

/* GET Cron tasks */
router.get('/debug', auth, function (req, res) {
    var keys = [];
    for (var key in schedule.scheduledJobs) {
        keys.push({
            name: key,
            date: schedule.scheduledJobs[key].nextInvocation()
        });
    }
    res.json({active_cron: keys});
});


/* PUT toggle system */
router.put('/toggle', auth, function (req, res, next) {
    var actual = req.app.clocks.get('up');
    if (req.body.up == actual) {
        res.json({ changed: false, up: req.body.up });
    } else {
        req.app.clocks.put('up', !actual, function (err, model) {
            if (err) return next(err);
            cronTasksManager(req.app.clocks.getAll());
            res.json({ changed: true, up: req.body.up });
        });
    }
});


/* PUT update clock */
router.put('/:name', auth, function (req, res, next) {
    req.app.clocks.put(req.params.name, req.body, function (err, model) {
        if (err) return next(err);
        cronTasksManager(req.app.clocks.getAll());
        res.json(model);
    });
});

module.exports = router;