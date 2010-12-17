
var log = require('logging').from(__filename);

var Jobvite = require('../lib/jobvite'),
    Reports = Jobvite.Reports;

function ready(data) {
   log(data);
}


Reports.config({
    report_id: false, //report id
    jobvite_username: false, //email address
    jobvite_password: false //use your password
});

Reports.load(ready);
