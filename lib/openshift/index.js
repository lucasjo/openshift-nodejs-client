/**
 * Created by kikimans on 2014-10-08.
 */
var https = require('https');
var url = require('url');

var openshiftClient = {

    excute : function(options, callback){
        var req = https.request(options, function(res){
            var datas = '';
            res.on('data', function(data) {
                datas += data;

            });
            res.on('error', function(e){
                console.error(e);
            });

            res.on('end', function(){
                if(datas){
                    callback(datas);
                }else{
                    callback('');
                }
                console.info('call end');
            });
        });
        req.on('error', function(e){
            console.error(e);
        });
        req.end();
    },
    excuteParam : function(options, param, callback){
        var req = https.request(options, function(res){
            var datas = '';
            res.on('data', function(data) {
                datas += data;

            });
            res.on('error', function(e){
                console.error(e);
            });

            res.on('end', function(){
                if(datas){
                    callback(datas);
                }else{
                    callback('');
                }
                console.info('call end');
            });
        });
        req.on('error', function(e){
            console.error(e);
        });

        console.log('param : ' + param);

        req.write(param);
        req.end();
    },

    optionsExcute : function(request, callback){
        var options = {
            hostname : url.parse(request.body.apiurl).hostname,
            port : 443,
            path : url.parse(request.body.apiurl).pathname,
            method : request.body.method,
            headers : {
                'Authorization': 'Basic ' + new Buffer(request.body.username + ':' + request.body.password).toString('base64'),
                'Accept': 'application/json'
            },
            rejectUnauthorized: false,
            agent: false
        };
        var queryStr = url.parse(request.body.apiurl).query;
        console.log('queryStr : ' + queryStr);
        if(queryStr!= null){
            options.headers['content-length'] = url.parse(request.body.apiurl).query.length;
        }
        var req = https.request(options, function(res){
            var datas = '';
            res.on('data', function(data) {
                datas += data;

            });
            res.on('error', function(e){
                console.error(e);
            });

            res.on('end', function(){
                if(datas){
                    callback(datas);
                }else{
                    callback('');
                }
                console.info('call end');
            });
        });
        req.on('error', function(e){
            console.error(e);
        });

        console.log('param : ' + queryStr);
        if(queryStr != null){
            req.write(queryStr);
        }
        req.end();
    }
};

module.exports = openshiftClient;