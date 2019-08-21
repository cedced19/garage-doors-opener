// test if user is authenticated
module.exports = function (req, res, next) {
    if (req.app.get('configurated')) {
        if (!req.isAuthenticated()) {
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                var err = new Error('Forbidden');
                err.status = 401;
                next(err);
            } else {
                res.redirect('/login');
            }
        } else {
            next();
        }
    } else {
        req.app.models.users.find().exec(function (err, models) {
            if (err) return next(err);
            if (models.length == 0) {
                next();
            } else {
                req.app.set('configurated', true); 
                if (!req.isAuthenticated()) {
                    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                        var err = new Error('Forbidden');
                        err.status = 401;
                        next(err);
                    } else {
                        res.redirect('/login');
                    }
                } else {
                    next();
                }
            }
        });
    }
};