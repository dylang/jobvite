'use strict';

module.exports = function (obj, source) {
    var keys = Object.keys(source);

    keys.forEach(function(key) {
        obj[key] = source[key];
    });
};

