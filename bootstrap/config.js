'use strict';

// Utilize Lo-Dash utility library
var _ = require('lodash');
var fs = require('fs');
var appPath = process.cwd();

// Load configurations
// Set the node environment variable if not set before
process.env.NODE_ENV = ~fs.readdirSync(appPath+'/config/env').map(function(file) {
    return file.slice(0, -3);
}).indexOf(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

// Extend the base configuration in all.js with environment
// specific configuration
module.exports = _.extend(
    require(appPath+'/config/env/all'),
    require(appPath+'/config/env/' + process.env.NODE_ENV) || {}
);
