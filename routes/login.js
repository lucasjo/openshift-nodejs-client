/**
 * Created by kikimans on 2014-10-07.
 */
var express = require('express');
var router = express.Router();


router
    .get('/', function(req, res, next) {
        res.render('login-form', { title: 'OpenShift Rest Api' });
    })
    .post('/', function(req, res, next){
        if(req.body.username && req.body.password){
            req.db.Account.findOne({account : req.body.username, passwd : req.body.password}, function(err, user){
                if(err) return next(err);
                if(user){
                    req.session.authenticate = true;
                    req.session.user = user
                    req.session.username = user.account;
                    res.redirect('../');
                }else{
                    console.log('false');
                    res.render('login-form', { title: 'OpenShift Rest Api' , message : 'Not Found User'});
                }

            });
        }else{
            next('username is not and password is not');
        }
    });

module.exports = router;