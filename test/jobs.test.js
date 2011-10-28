var log = require('logging').from(__filename);

var Jobvite = require('../lib/jobvite'),
    Jobs = Jobvite.Jobs;

Jobs.config({
                jobvite_company_id: 'qgY9Vfw2',
                cache_directory: './test/data'
            });

module.exports = {
        load: function (test) {
            test.expect(2);

            Jobs.load(function(err, data){
                test.ok(!err);
                test.ok(data);
                test.done();
            });
        },
        reload: function(test){
            test.expect(2);
            var saveDataBoolean = false;
            Jobs.reload(cb, saveDataBoolean);
            function cb(err, data){
                test.ok(!err);
                test.ok(data);
                test.done();
            }
        }
};


