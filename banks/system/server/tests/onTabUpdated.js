'use strict';

var Should = require('should');
var io = require('socket.io-client');
var url = 'http://127.0.0.1:3005'





describe('Testing Bank Caixa', function(){
	
	describe("socket.emit('onTabUpdated')", function(){
		
		var emitEventName = 'onTabUpdated';
		var okOnEventName = 'injectContentScriptByTabId';
		var errOnEventName = 'err_InjectContentScriptByTabId';

		it("Sending correct params -> should fire event injectContentScriptByTabId",function(done){
			var socket = io(url, {forceNew: true });
			var tab = {
				url : 'https://internetbanking.caixa.gov.br',
				id : 123
			}

			socket.emit(emitEventName, tab);

			socket.on(okOnEventName, function(tabId, contentScript){
				Should(tabId).be.exactly(tab.id);
				Should(contentScript).be.ok;
				socket.disconnect();
				done();
			});
		});

		it("Sending incorrect params (tab.id = null) -> should fire event err_InjectContentScriptByTabId",function(done){
			var socket = io(url, {forceNew: true });
			var tab = {
				url : 'https://internetbanking.caixa.gov.br'
			}

			socket.emit(emitEventName, tab);

			socket.on(errOnEventName, function(data){
				socket.disconnect();
				done();
			});
		});

		// it("Sending incorrect params (tab = null) -> should fire event err_InjectContentScriptByTabId",function(done){
		// 	var socket = io(url, {forceNew: true });
		// 	var tab = null;
		// 	socket.emit(emitEventName, tab);

		// 	socket.on(errOnEventName, function(){
		// 		done();
		// 	});
		// });

		// it("Sending incorrect params (invalidr tab.url) -> should fire event err_InjectContentScriptByTabId",function(done){
		// 	var socket = io(url, {forceNew: true });
		// 	var tab = {
		// 		urk : '!@@#$%&%$#@'
		// 	};
		// 	socket.emit(emitEventName, tab);

		// 	socket.on(errOnEventName, function(){
		// 		done();
		// 	});
		// });
	});

});

