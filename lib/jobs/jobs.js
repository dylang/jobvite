/*!
 * OPOWER Jobs
 * Copyright(c) 2010 Dylan Greene <dylang@gmail.com>
 * MIT Licensed
 */

var log = require('logging').from(__filename),
    extend = require('../util/extend'),
    jobData,
    Format = require('./format'),
    Changelog = require('./changelog'),
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
            log('ERROR', 'No data from update!');
            callback();
        }
    }, saveDataBoolean);
}


function search(query) {
    query = Format.remove_html(query).replace(/[^a-zA-Z]/g, ' ').replace(/\s\s/g, ' ') || false;
    if (!query) { return; }
    var jobs = [],
        search_array = query.toLowerCase().split(/[\s|\+]/);

    jobData.all_search.forEach(function(value, key) {
        jobs.push(value);
    });

    search_array.forEach(function(search_for) {
        jobs = jobs.filter(function(value) {
            return value.search_string.search(search_for) !== -1;
        });
    });

    log('search:', query, 'results:', jobs.length);

    return jobs;
}

function team(team_id, location) {
    var out;
    jobData.all_jobs[location].forEach(function(team_obj) {
        if (team_obj.team == team_id) {
            out = team_obj.jobs;
        }
    });
    return out;
}

function process_data(raw_data, callback) {
    var changes;

    if (raw_data) {
        var new_data = Format.jobData(raw_data),
            old_data = jobData;

            changes = Changelog(old_data, new_data);

        if (new_data) {
            jobData = new_data;
            log('load complete.', 'total jobs:', Object.keys(jobData.all_ids).length, 'critical:', jobData.all_critical.length);
        } else {
            log('new data did not work');
        }
    } else {
        log('No raw data from update');
    }

    callback && callback(changes);
}

function load_data(callback) {
    Download.load_cache(function(raw_data){
        if (!raw_data) {
            log('No data in cache, re-building cache.');
            Download.save_cache(function() { load_data(callback); });
        } else {
            process_data(raw_data, callback);
        }
    });
}

function data() {
    return jobData;
}

function config(options_) {
    extend(options, options_);
    Download.config(options);
    return this;
}

function init(callback) {
    
    setTimeout(function() {
        load_data(callback);
    }, 20);
}



module.exports.config = config;
module.exports.init = init;
module.exports.data = data;
module.exports.search = search;
module.exports.reload = reload;
module.exports.team = team;
