/**
 * Created by kikimans on 2014-10-08.
 */
var https = require('https');
var url = require('url');



var openshiftClient = {

    excute : function(options, callback){
        var req = https.request(options, function(res){
            res.on('data', function(data) {
                if(data){
                    callback(data);
                }else{
                    callback('');
                }

            });
            res.on('error', function(e){
                console.error(e);
            });

            res.on('end', function(){
                console.info('call end');
            });
        });
        req.on('error', function(e){
            console.error(e);
        });
        req.end();
    }
};

module.exports = openshiftClient;