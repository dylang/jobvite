'use strict';

module.exports = function(grunt) {

    require('time-grunt')(grunt);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-notify');

    grunt.initConfig({
        mochaTest: {
            options: {
                reporter: 'spec',
                timeout: 9999999
            },
            src: ['test/**/*.test.js']
        },
        jshint: {
            options: {
                globalstrict: true,
                newcap: false,
                node: true,
                expr: true
            },
            gruntfile: {
                files: {
                    src: [
                        'Gruntfile.js'
                    ]
                }
            },
            lib: {
                files: {
                    src: [
                        'lib/**/*.js',
                    ]
                }
            }
        }
    });

    grunt.registerTask('default', 'test');

    grunt.registerTask('test', [
        'jshint'
    ]);
};
