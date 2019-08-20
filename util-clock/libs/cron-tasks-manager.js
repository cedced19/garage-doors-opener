var suncalc = require('suncalc');
var schedule = require('node-schedule');
var garageInterface = require('./garage-interface');

function getNightDate(clock) {
    var date = new Date();
    // Get sunset
    var sunset = suncalc.getTimes(date, process.env.COORDS_LAT, process.env.COORDS_LNG).sunset;
    if (sunset.getTime() < (new Date()).getTime()) {
        date.setDate(date.getDate() + 1);
        sunset = suncalc.getTimes(date, process.env.COORDS_LAT, process.env.COORDS_LNG).sunset;
    }
    // Get limit date
    var h = clock.hour, m = clock.minute;
    var tmpDate = new Date();
    if (tmpDate.getHours() > h) {
        tmpDate.setDate(date.getDate() + 1);
    }
    tmpDate.setHours(h);
    tmpDate.setMinutes(m);
    // Compare
    if (sunset.getTime() < tmpDate.getTime()) {
        return tmpDate;
    } else {
        return sunset;
    }
}

function getMorningDate(clock) {
    var h = clock.hour, m = clock.minute;
    var date = new Date();
    if (date.getHours() > h) {
        date.setDate(date.getDate() + 1);
    }
    date.setHours(h);
    date.setMinutes(m);
    return date;
}

module.exports = function (data) {
    // Delete previous event
    if (schedule.scheduledJobs.hasOwnProperty('morning')) {
        schedule.scheduledJobs.morning.cancel();
    }
    if (schedule.scheduledJobs.hasOwnProperty('night')) {
        schedule.scheduledJobs.night.cancel();
    }
    if (data.up) { // Check if event have to be set 
        schedule.scheduleJob('morning', getMorningDate(data.morning), function () {
            garageInterface.open(function (err) {
                if (err) console.error(err); // Assume that we can access to the log to debug after
            });
        });
        schedule.scheduleJob('night', getNightDate(data.night), function () {
            garageInterface.close(function (err) {
                if (err) console.error(err); // Assume that we can access to the log to debug after
            });
        });
    }
}
