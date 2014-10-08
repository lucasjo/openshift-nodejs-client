/**
 * Created by kikimans on 2014-10-08.
 */

var express = require('express');
var router = express.Router();

router
    .get('/', function(req, res, next) {
        req.db.Account.find({}, function(err, list){
            if(err) return next(err);
            res.status(200).json(list);
        })
    });


module.exports = router;