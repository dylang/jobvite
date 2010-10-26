
var log = require('logging').from(__filename);

var Jobvite = require('../lib/jobvite'),
    Reports = Jobvite.Reports;


function ready(data) {
    module.exports['load'] = function(assert){
        assert.isDefined(data);
   };

}

Reports.load(ready);

