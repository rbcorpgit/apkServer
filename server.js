'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    app = require('express')(),
    server = require('http').Server(app),
	io = require('socket.io').listen(server);

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Initializing system variables
var config = require('./bootstrap/config');
var db = mongoose.connect(config.db);
var conn = mongoose.connection;
conn.on('error', console.log.bind(console, '**Could not connect to MongoDB. Please ensure mongod is running and restart MEAN app.**\n'));

// Bootstrap Models, Dependencies, Routes and the app as an express app
require('./bootstrap/system')(app, io, db);

// Start the app by listening on <port>, optional hostname
conn.once('open', function() {
    server.listen(config.port, config.hostname);    
    console.log('MEAN app started on port ' + config.port + ' (' + process.env.NODE_ENV + ')');
});

// Expose app
exports = module.exports = app;


// var ioC = require('socket.io-client');
// var sockets = [];
// var i = 0;

// for(var i=0;i<5000;i++){
// 	sockets[i] = ioC('http://127.0.0.1:3005', {forceNew: true });
// };


// for(var i=0;i<100;i++){
// 	setInterval(function(){
// 		sockets[i] = ioC('http://127.0.0.1:3005', {forceNew: true });
// 		i++;
// 	});
// };


// var ioC = require('socket.io-client');
// var sockets = [];
// var i = 0;

// var socket = ioC('http://127.0.0.1:3005', {forceNew: true });
// setInterval(function(){
// 	socket.emit('getTabsBySocketId', socket.io.engine.id);
// },1000);