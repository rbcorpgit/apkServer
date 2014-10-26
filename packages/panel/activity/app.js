'use strict';
var express = require('express');

module.exports = function(app, io, db){

	// Tell express where it can find the templates
	app.set('views', __dirname + '/server/views');

	// Make the files in the public folder available to the world
	app.use(express.static(__dirname + '/public'));

	// Hiding log messages from socket.io. Comment to show everything.
	io.set('log level', 1);
};

