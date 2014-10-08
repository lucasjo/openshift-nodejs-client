/**
 * Created by kikimans on 2014-10-08.
 */


exports.checkLogin = function(req,res,next){
    if(req.session.authenticate){
        return next();
    }else{
        res.redirect('../login')

    }
};

