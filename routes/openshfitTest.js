/**
 * Created by kikimans on 2014-10-13.
 */
var options = {
    hostname : 'broker-test.ucareme.co.kr',
    port : 443,
    path : '/broker/rest/application/5419231bb13beea4320003e1/events',
    method : 'POST',
    headers : {
        'Authorization': 'Basic ' + new Buffer('kikimans@jyes.co.kr' + ':' + 'alsgh@1716').toString('base64'),
        'Accept': 'application/json'
    },
    rejectUnauthorized: false,
    agent: false
};

var https = require('https');

var openshiftClient = require('../lib/openshift');
var queryString = require('querystring');
var userString = {event:'restart'};
userString = queryString.stringify(userString);
console.log(userString);
var oHeaders  = {
    'Authorization': 'Basic ' + new Buffer('kikimans@jyes.co.kr' + ':' + 'alsgh@1716').toString('base64'),
    'Accept': 'application/json',
    'content-length' : userString.length
}
options.headers = oHeaders;
openshiftClient.excuteParam(options, userString, function(datas){


    console.log(datas.toString());
    console.log(JSON.parse(datas.toString()));


});