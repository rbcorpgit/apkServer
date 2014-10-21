'use strict';

var appPath = process.cwd();
var util = require(appPath+'/lib/util');


module.exports = function(app, io, db) {

    //Express settings
    require(appPath + '/config/express')(app, db);

    function bootstrapPackages() {
        // Bootstrap models

        var excludeDir = [
        	'background',
            'content'
        ];

        util.walk(appPath + '/banks', '*', excludeDir, function(path) {
            require(path)(app, io, db);
        });
    }

    bootstrapPackages();


};
