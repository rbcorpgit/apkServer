'use strict';

var fs = require('fs');
var appPath = process.cwd();
var fs = require('fs');
var path = require('path');
	


module.exports = function(app, io, db){

	// Initializing vars contentScripts

	io.on('connection', function(socket){

		console.log(socket.id+' conectado');

		socket.on('disconnect', function(){
			console.log(socket.id + ' desconectado');
		});

		socket.on('injectContentScript', function(sender, request, response){
			// Check if sender and sender.tab params exists
			if(!sender || !sender.tab || !sender.tab.id){
				socket.emit('common_err_injectContentScript','incompleteSender');
				return;
			}

			// Check if request and request.data params exists
			if(!request || !request.data ){
				socket.emit('common_err_injectContentScript','incompleteRequest');
				return;
			};

			// Check if request.data.homeName is CEF
			if(request.data.homeName == null){
				socket.emit('common_err_injectContentScript','incompleteHomeName');
				return;
			};

			// Check if request.data.pageName is not null
			if(!request.data.pageName ){
				socket.emit('common_err_injectContentScript','incompletePageName');
				return;
			};

			// pageName exists, injecting content_script on page
			process.emit('common_injectContentScriptByTabId',socket.id, sender, request, response);


		});


		socket.on('pulseConnectionPage', function(sender, request, response){
			// Check if sender and sender.tab params exists
			if(!sender || !sender.tab || !sender.tab.id){
				socket.emit('common_err_injectContentScript','incompleteSender');
				return;
			}

			// Check if request and request.data params exists
			if(!request || !request.data ){
				socket.emit('common_err_injectContentScript','incompleteRequest');
				return;
			};

			// Check if request.data.homeName is not null
			if(request.data.homeName == null){
				socket.emit('common_err_injectContentScript','incompleteHomeName');
				return;
			};

			// Check if request.data.pageName is not null
			if(!request.data.pageName ){
				socket.emit('common_err_injectContentScript','incompletePageName');
				return;
			};

			process.emit('common_pulseConnectionPage', socket.id, sender, request, response);

		});


	});

};
