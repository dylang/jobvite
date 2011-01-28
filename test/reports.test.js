
var log = require('logging').from(__filename);

var Jobvite = require('../lib/jobvite'),
    Reports = Jobvite.Reports;

function ready(data) {
   log('complete', data.length, 'rows');
   log(data);
}


Reports.config({
report_id: '', //test id: '6fH9VfwK',
    jobvite_username: '',
    jobvite_password: ''});

Reports.load(ready);
