/*!
 * OPOWER Jobs
 * Copyright(c) 2010 Dylan Greene <dylang@gmail.com>
 * MIT Licensed
 */

var log = require('logging').from(__filename),
    request = require('request'),
    xml2js,
    extend = require('../util/extend'),
    Cache = require('../util/cache');

var JOBVITE_XML_FEED = 'http://www.jobvite.com/CompanyJobs/Xml.aspx?c=';

var options = {
    jobvite_company_id: 'xxxxxxx',
    cache_directory: './data'
};

function config(options_) {
    extend(options, options_);
}

function cache_full_path() {
    // TODO: directory path merge?
    return options.cache_directory + '/jobs-' + options.jobvite_company_id;
}

function download(callback, andSave) {
    var url = JOBVITE_XML_FEED + options.jobvite_company_id;

    log('load from', url); 

    request({uri: url}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var cb = andSave ? function(data) {
                Cache.save(cache_full_path(), JSON.stringify(data));
                callback && callback(data);
            } : callback;
            parseXML(body, cb);
        }
        else {
            log('Trouble loading xml.');
            log(error);
            log(response);
            callback && callback();
        }
    });
}

function parseXML(xml, callback) {
    xml2js = require('xml2js');
    var x2js = new xml2js.Parser();

    x2js.addListener('end', function(data) {
        callback(data);
    });

    x2js.parseString(xml);
}

function load_cache(callback){
    return Cache.load(cache_full_path(), callback);
}

function save_cache(callback) {
    download(callback, true);
}

exports.config = config;
exports.load_cache = load_cache;
exports.save_cache = save_cache;
exports.download = download;


