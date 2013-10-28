'use strict';

/*!
 * OPOWER Jobs
 * Copyright(c) 2010 Dylan Greene <dylang@gmail.com>
 * MIT Licensed
 */

var log = require('logging').from(__filename),
    extend = require('../util/extend'),
    Format = require('./format'),
    Download = require('./download');

var options = {
    jobvite_company_id: 'qgY9Vfw2',
    cache_directory: './data'
};

function reload(callback, saveDataBoolean) {
    Download.download(function(raw_data) {
        if (raw_data) {
           process_data(raw_data, callback);
        } else {
            callback('No data from update!');
        }
    }, saveDataBoolean);
}

function process_data(raw_data, callback) {

    if (!raw_data) {
        callback('No raw data');
        return;
    }

    var jobs_array = Format.process(raw_data);

    log('load complete.', 'total jobs:', jobs_array.length);
    callback(null, jobs_array);
}

function config(options_) {
    extend(options, options_);
    Download.config(options);
    /* jshint -W040 */
    return this;
    /* jshint +W040 */
}

module.exports.config = config;
module.exports.reload = reload;
