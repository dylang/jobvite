'use strict';

var log = require('logging').from(__filename),
    extend = require('../util/extend'),
    Request = require('./request');

var options = {};

function config(options_) {
    extend(options, options_);
    /* jshint -W040 */
    return this;
    /* jshint +W040 */
}

function load(callback){
    Request.config(options)
          .getData(callback);
}

module.exports.config = config;
module.exports.load = load;