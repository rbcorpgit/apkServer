'use strict';

var appPath = process.cwd();
var glob = require("glob");



module.exports = function(app, io, db) {

    //Express settings
    require(appPath + '/config/express')(app, db);

    function bootstrapPackages() {

        // options is optional
        glob(appPath+"/banks/*/server/routes/*.js", null, function (er, files) {
            for(var i in files)
                require(files[i])(app, io, db);
        })

    }

    bootstrapPackages();


};
