/**
 * Created by kikimans on 2014-10-08.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.Account = new Schema({
    account : String,
    passwd : String
});