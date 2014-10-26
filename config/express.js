'use strict';

/**
 * Module dependencies.
 */
var express = require('express');
var morgan = require('morgan');
var config = require('./config');
var appPath = process.cwd();
var consolidate = require('consolidate');
var redis = require('socket.io-redis');


module.exports = function(app, io, db) {

    // Only use logger for development environment
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // assign the template engine to .html files
    app.engine('html', consolidate[config.templateEngine]);

    // set .html as the default extension
    app.set('view engine', 'html');
  	
  	io.adapter(redis({ host: 'localhost', port: 6379 }));

};
