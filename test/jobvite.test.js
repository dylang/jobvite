
var log = require('logging').from(__filename);

var Jobvite = require('../lib/jobvite');

module.exports['jobvite'] = function(test){
    test.expect(Jobvite);
    test.done();
};


module.exports['jobvite jobs'] = function(test){
    test.expect(Jobvite.Jobs);
    test.done();
};

module.exports['jobvite reports'] = function(test){
    test.expect(Jobvite.Reports);
    test.done();
};
