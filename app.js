var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');



var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//use seeesion

app.use(session(
    {
        secret: '1234567890QWERTY',
        saveUninitialized: true,
        resave : true
    })
);
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

//mongodb
var dbUrl = process.env.MONGODB_URL || 'mongodb://openshift:redhat@210.122.2.138:27017/openshift_broker';
var mongoose = require('mongoose');
var connection = mongoose.createConnection(dbUrl);
connection.on('error', console.error.bind(console, 'connection error : '));
connection.once('open', function(){
    console.info('connected to database');
});

var models = require('./models');
function db(req,res,next){
    req.db = {
        Account : connection.model('account', models.Account, 'account')
    };
    return next();
}


var common = require('./routes/common');
console.log(common.checkLogin);
var isAuth = common.checkLogin;

app.use('/', routes);
app.use('/users', users);

var account = require('./routes/account');
app.use('/account', db, account);

var login = require('./routes/login');
app.use('/login', db, login);

app.get('/logout', function(req,res,next){
    if(req.session.username){
        req.session.destroy(function(error) {
            if(!error){
                res.redirect('../');
            }
        });
    };
});

//apitest
var apitest = require('./routes/apitest');
app.use('/apitest', isAuth, apitest);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

console.log(app.get('env'));
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
