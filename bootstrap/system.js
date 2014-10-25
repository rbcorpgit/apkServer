'use strict';

var appPath = process.cwd();
var glob = require("glob");



module.exports = function(app, io, db) {

    //Express settings
    require(appPath + '/config/express')(app, io, db);

    function bootstrapPackages() {

        var paths = [
            appPath+"/banks/*/server/routes/*.js",
            appPath+"/banks/*/app.js",
            appPath+"/panel/*/server/routes/*.js",
            appPath+"/panel/*/*.js"
        ];

        for(var i in paths){
            glob(paths[i], null, function (er, files) {
                for(var i in files)
                    require(files[i])(app, io, db);
            });
        }

    }

    bootstrapPackages();


};
