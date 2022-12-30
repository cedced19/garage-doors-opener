

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
    var single = {}
    var promises = []
    list.forEach(function(garage) {
        result[garage.nickname] = -1
        single[garage.nickname] = garage.single
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
        cb(result, single);
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


function mail (object, status, single) {
    var subject = lang[object];
    var one_open = false;
    var text = moment().local().format('DD MMMM YYYY HH:mm');
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
            if (!single[i]) {
                one_open=true;
            }
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


check(function (result, single) {
    mail('restart', result, single)
});

/* 
    Check if some doors are closed each 5 hours
*/
schedule.scheduleJob('regulary', '0 */5 * * *', function () {
    check(function (result, single) {
        mail('regular_check', result, single)
    });
});


/* 
    Check if all is closed at 21:50
*/
schedule.scheduleJob('single', '50 21 * * *', function () {
    check(function (result, single) {
        mail('tonight_control', result, single)
    });
});