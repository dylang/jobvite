/*!
 * OPOWER Jobs
 * Copyright(c) 2010 Dylan Greene <dylang@gmail.com>
 * MIT Licensed
 */

var log = require('logging').from(__filename),
    Constants = require('./constants');

function pad(n) { return n <10 ? '0' + n : n; }

function createTimeFromString(str) {
    str = str || '000000';
    var seconds = parseInt(str.substr(1, 4), 36) % 86400;
    var hours = Math.floor(seconds/3600);
    var minutes = Math.floor((seconds-(hours*3600))/60);
    seconds = seconds - hours * 3600 - minutes * 60;
    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}



function process(raw_data) {
    if (!raw_data || !raw_data.job) {
        return false;
    }

    var jobs_array = [];

    //Set up initial array
    raw_data.job.forEach(function(job) {

        jobs_array.push({
            id:         job.id.trim(),
            title:      job.title.trim(),
            team:       job.category.trim(),
            location:   job.location.trim(),
            date:       new Date(job.date + ' ' + createTimeFromString(job.id)),
            description: (job.description && job.description.trim) ? job.description.trim()
                            : (job.briefdescription && job.briefdescription.trim) ? job.briefdescription.trim()
                            : false
        });

    });

    return jobs_array;
}


module.exports.process = process;
