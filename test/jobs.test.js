'use strict';

var expect = require('chai').expect;

describe('jobs', function(){
    var Jobvite = require('../lib/jobvite');
    var Jobs = Jobvite.Jobs;

    beforeEach(function(){
        Jobs.config({
            jobvite_company_id: 'qgY9Vfw2',
            cache_directory: './test/data'
        });
    });


    it('should load', function(done){
        Jobs.reload(function(err, data){
            console.log('reload', arguments);
            expect(err).to.be.a('null');
            expect(data).to.be.instanceof(Array);
            done();
        });
    });
    /*

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
        */

});