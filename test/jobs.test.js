require('proto');
var log = require('logging').from(__filename);

var Jobvite = require('../lib/jobvite'),
    Jobs = Jobvite.Jobs;

var jobData;

function ready() {
    module.exports['init'] = function(assert){
        log('init');
        jobData = Jobs.data();
        assert.isDefined(jobData);
   };


    module.exports['download'] = function(assert){
        log('download');
        var saveDataBoolean = false;
        function callback(changes){
            assert.isDefined(changes);
        }

        jobData = Jobs.reload(callback, saveDataBoolean);

    };
}
Jobs.config({
    jobvite_company_id: 'qgY9Vfw2',
    cache_directory: './test/data'
}).init(ready);

