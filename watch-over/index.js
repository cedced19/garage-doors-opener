

var list = require('./list.json');
var config = require('./config.json');

var lang = require('./i18n/'+config.language+'.json');

var schedule = require('node-schedule');
var get = require('simple-get');
var nodemailer = require('nodemailer');
var moment = require('moment');
moment.locale(config.language);

function getAddress(garage) {
    return 'http://' + garage.address + '/garage/' + garage.number + '/status/' + garage.password;
};

function check (cb) {
    var result = {}
    var promises = []
    list.forEach(function(garage) {
        result[garage.nickname] = -1
        prom = new Promise(function(resolve, reject) {
            get.concat({
                url: getAddress(garage),
                json: true
            }, function (err, res, data) {
                if (err) return resolve();
                if (data.closed) {
                    result[garage.nickname] = 0
                } else {
                    result[garage.nickname] = 1
                }
                resolve();
            })
        });
        promises.push(prom)
    });
    Promise.all(promises).then(_ => { 
        cb(result);
    });
}


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: config.sender
});

function sendMail (subject, text) {
    var mailOptions = {
        from: 'Watch Over <' + config.sender.user + '>',
        to: config.mails.join(),
        subject: subject,
        html: text
    };
    transporter.sendMail(mailOptions, (err) => {
        if (err) return console.error('Error: ', err)
    });
}


function mail (object, status) {
    var subject = lang[object];
    var one_open = false;
    var text = moment().format('DD MMMM YYYY hh:mm');
    text+='<br><br>';
    for (i in status) {
        text += i + ': '
        if (status[i] == -1) {
            text+= lang['undefined'];
        }
        if (status[i] == 0) {
            text+= lang['closed'];
        }
        if (status[i] == 1) {
            text+= '<b>' + lang['open'] + '</b>';
            one_open=true;
        }
        text+='<br>';
    }
    if (one_open) {
        subject += ': ' + lang['warning_message']
    }
    if (object == 'regular_check' && !one_open) {
        return false
    }
    sendMail(subject, text)
}


check(function (result) {
    mail('restart', result)
});

/* 
    Check if some doors are closed each 5 hours
*/
schedule.scheduleJob('regulary', '0 */5 * * *', function () {
    check(function (result) {
        mail('regular_check', result)
    });
});


/* 
    Check if all is closed at 21:50
*/
schedule.scheduleJob('single', '50 21 * * *', function () {
    check(function (result) {
        mail('tonight_control', result)
    });
});