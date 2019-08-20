var express = require('express');
var router = express.Router();
var auth = require('../policies/auth');
var garageInterface = require('../libs/garage-interface');

/* GET execute gatage interface */
router.get('/:interface', auth, function (req, res, next) {
    garageInterface[req.params.interface](function (err,model) {
        if (err) return next(err);
        res.json(model);
    });
});


module.exports = router;