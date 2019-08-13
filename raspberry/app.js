const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const app = express();
const helmet = require('helmet');
const logger = require('morgan');
const compress = require('compression');
const Gpio = require('onoff').Gpio;

app.use(favicon(path.join(__dirname, 'favicon.ico')));

app.use(compress());

if (app.get('env') === 'development') {
    app.use(logger('dev'));
} else {
    app.use(compress());
    app.use(helmet());
}


/*

    CHANGE THIS PART

*/

/*

    DO NOT CHANGE THIS PART

*/

const toogle = new Gpio(17, 'out');
toogle.writeSync(true);
const status = new Gpio(4, 'in', 'both');

app.get('/garage/1/toggle/j0ugKdDQ4', function (req, res, next) {
    console.log('e')
    res.send({ toggling: true });
    toogle.writeSync(false);
    // Stop blinking the LED after 1 second
    setTimeout(function () {
        toogle.writeSync(true);
    }, 1000);
});

app.get('/garage/1/status/j0ugKdDQ41', function (req, res, next) {
    status.read((err, value) => { 
        if (err) return next(err)
        res.send({ closed: value });
    });
    
});



// error handlers


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not found');
    err.status = 404;
    next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            status: err.status || 500,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        status: err.status || 500,
        error: {}
    });
});



module.exports = app;