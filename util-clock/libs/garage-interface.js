var request = require('request-json');


function getStatus (cb) {
    var client = request.createClient(process.env.GARAGE_ADDRESS);
    client.get(`/garage/${process.env.GARAGE_NUMBER}/status/${process.env.GARAGE_PASSWORD}`, function(err, res, body) {
        cb(err, body);
    });
}

function toggle (closed, cb) {
    getStatus(function (err, status) {
        if (err) return cb(err);
        if (status.closed == closed) {
            cb(null,status);
        } else {
            var client = request.createClient(process.env.GARAGE_ADDRESS);
            client.get(`/garage/${process.env.GARAGE_NUMBER}/toggle/${process.env.GARAGE_PASSWORD}`, function(err) {
                if (err) return cb(err);
                cb(null,{closed: closed});
            });
        }
    })
}

module.exports = {
    open: function (cb) { // `open(function (err) {...})` open if not opened
        toggle(false, cb);
    },
    close: function (cb) { // `close(function (err) {...})` close if not closed
        toggle(true, cb);
    },
    status: getStatus 
}