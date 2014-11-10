
var log = require('logging').from(__filename);

var Jobvite = require('../lib/jobvite'),
    Reports = Jobvite.Reports;

function ready(data) {
   log('complete', data.length, 'rows');
}

Reports.config({
report_id: '6yWaVfwj', //test id: '6fH9VfwK',
    jobvite_username: process.env.JOBVITE_USERNAME,
    jobvite_password: process.env.JOBVITE_PASSWORD
});

Reports.load(ready);
