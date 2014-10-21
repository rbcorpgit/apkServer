'use strict';

/**
 * Module dependencies.
 */
var express = require('express');
var morgan = require('morgan');
var config = require('./config');
var appPath = process.cwd();
var consolidate = require('consolidate');

module.exports = function(app, db) {

    // Only use logger for development environment
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // assign the template engine to .html files
    app.engine('html', consolidate[config.templateEngine]);

    // set .html as the default extension
    app.set('view engine', 'html');

    // Set views path, template engine and default layout
    app.set('views', config.root + '/server/views');

    app.use('/public', express.static(config.root + '/public'));

};
