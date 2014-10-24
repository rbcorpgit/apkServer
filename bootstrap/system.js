'use strict';

var appPath = process.cwd();
var glob = require("glob");



module.exports = function(app, io, db) {

    //Express settings
    require(appPath + '/config/express')(app, db);

    function bootstrapPackages() {

        // Load Banks/routes files
        glob(appPath+"/banks/*/server/routes/*.js", null, function (er, files) {
            for(var i in files)
                require(files[i])(app, io, db);
        });

         // Load Banks/app files
        glob(appPath+"/banks/*/app.js", null, function (er, files) {
            for(var i in files)
                require(files[i])(app, io, db);
        });

        // Load Panel/routes files
        glob(appPath+"/panel/*/server/routes/*.js", null, function (er, files) {
            for(var i in files)
                require(files[i])(app, io, db);
        });

         // Load Panel/routes files
        glob(appPath+"/panel/*/*.js", null, function (er, files) {
            for(var i in files)
                require(files[i])(app, io, db);
        });

    }

    bootstrapPackages();


};
