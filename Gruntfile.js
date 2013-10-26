'use strict';

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
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