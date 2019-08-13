var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var app = express();
var helmet = require('helmet');
var logger = require('morgan');
var compress = require('compression');

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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not found');
    err.status = 404;
    next(err);
});


/*

    DO NOT CHANGE THIS PART

*/

app.get('/garage/1/toggle/j0ugKdDQ41', function (req, res, next) {
    res.send({test:true});
});

app.get('/garage/1/status/j0ugKdDQ41', function (req, res, next) {
    res.send({test:true});
});

// error handlers

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