/**
 * Created by kikimans on 2014-10-08.
 */
var express = require('express');
var router = express.Router();

var url = require('url');
var https = require('https');

var openshiftClient = require('../lib/openshift');

var options = {
    hostname : 'broker-test.ucareme.co.kr',
    port : 443,
    path : '/broker/rest/api',
    method : 'GET',
    headers : {
        'Authorization': 'Basic ' + new Buffer('kikimans@jyes.co.kr' + ':' + 'alsgh@1716').toString('base64'),
        'Accept': 'application/json'
    },
    rejectUnauthorized: false,
    agent: false
};

router
    .get('/', function(req,res){
        res.render('api-test');
    })
    .post('/', function(req,res){

        console.log(req.body.apiurl);
        options.hostname = url.parse(req.body.apiurl).hostname;
        options.path = url.parse(req.body.apiurl).pathname;
        options.method = req.body.method;
        options.headers.Authorization = 'Basic ' + new Buffer(req.body.username + ':' + req.body.password).toString('base64');
        options.agent = new https.Agent(options);

        console.log('option : ' + options);
        openshiftClient.optionsExcute(req, function(datas){

            if(datas){
              res.status(200).json(JSON.parse(datas.toString('utf-8')));
            }else{
                res.redirect('./api-test');
            }
        });

    })


module.exports = router;