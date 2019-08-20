// test if user is authenticated
module.exports = function (req, res, next) {
    req.app.keys.get('id', req.params.id, function (err, model) {
        if (err) return next(err);
        if ((new Date(model.date)).getTime() < (new Date()).getTime()) {
            var err = new Error('Forbidden');
            err.status = 401;
            next(err);
        }
        next();
    });
};