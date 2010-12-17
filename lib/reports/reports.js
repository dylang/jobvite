var log = require('logging').from(__filename),
    extend = require('../util/extend'),
    Request = require('./request');

var options = {};

function config(options_) {
    extend(options, options_);
    return this;
}

function load(callback){
    Request.config(options)
          .getData(callback);
}

module.exports.config = config;
module.exports.load = load;