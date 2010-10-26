var log = require('logging').from(__filename),
    extend = require('../util/extend'),
    Scrape = require('./scrape');

var options = {};

function config(options_) {
    extend(options, options_);
    return this;
}

function load(callback){
    Scrape.config(options)
          .getData(callback);
}

module.exports.config = config;
module.exports.load = load;