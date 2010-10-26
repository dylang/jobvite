
var log = require('logging').from(__filename);

var Jobvite = require('../lib/jobvite');

module.exports['jobvite'] = function(assert){
    assert.isDefined(Jobvite);
};


module.exports['jobvite jobs'] = function(assert){
    assert.isDefined(Jobvite.Jobs);
};

module.exports['jobvite reports'] = function(assert){
    assert.isDefined(Jobvite.Reports);
};
