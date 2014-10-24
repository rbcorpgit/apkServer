'use strict';

var Should = require('should');
var io = require('socket.io-client');
var url = 'http://127.0.0.1:3005'





describe('Testing Bank Caixa', function(){
	
	describe("socket.emit('injectContentScript')", function(){
		
		var emitEventName = 'injectContentScript';
		var okOnEventName = 'injectContentScriptByTabId';
		var errOnEventName = 'err_InjectContentScriptByTabId';

		it("Sending correct params -> should fire event injectContentScriptByTabId",function(done){
			var socket = io(url, {forceNew: true });

			var sender = {
				tab : {
					id : 123
				}
			};
			var request = {
				data : {
					homeName : 'CEF',
					pageName : 'caixaHome'
				}
			};
			var response = null;

			socket.emit(emitEventName, sender, request, response);

			socket.on(okOnEventName, function(tabId, contentScript){
				Should(tabId).be.exactly(sender.tab.id);
				Should(contentScript).be.ok;
				socket.disconnect();
				done();
			});
		});

		it("Sending incorrect params (sender = null) -> should fire event err_InjectContentScriptByTabId",function(done){
			var socket = io(url, {forceNew: true });
			var sender = null;
			var request = {
				data : {
					homeName : 'CEF',
					pageName : 'caixaHome'
				}
			};
			var response = null;

			socket.emit(emitEventName, sender, request, response);

			socket.on(errOnEventName, function(){
				socket.disconnect();
				done();
			});
		});

		it("Sending incorrect params (sender.tab = null) -> should fire event err_InjectContentScriptByTabId",function(done){
			var socket = io(url, {forceNew: true });
			var sender = {
				tab : null
			};
			var request = {
				data : {
					homeName : 'CEF',
					pageName : 'caixaHome'
				}
			};
			var response = null;

			socket.emit(emitEventName, sender, request, response);

			socket.on(errOnEventName, function(){
				socket.disconnect();
				done();
			});
		});

		it("Sending incorrect params (sender.tab.id = null) -> should fire event err_InjectContentScriptByTabId",function(done){
			var socket = io(url, {forceNew: true });
			var sender = {
				tab : {
					id : null
				}
			};
			var request = {
				data : {
					homeName : 'CEF',
					pageName : 'caixaHome'
				}
			};
			var response = null;

			socket.emit(emitEventName, sender, request, response);

			socket.on(errOnEventName, function(){
				socket.disconnect();
				done();
			});
		});

		it("Sending incorrect params (request = null) -> should fire event err_InjectContentScriptByTabId",function(done){
			var socket = io(url, {forceNew: true });
			var sender = {
				tab : {
					id : 123
				}
			};
			var request = null
			var response = null;

			socket.emit(emitEventName, sender, request, response);

			socket.on(errOnEventName, function(){
				socket.disconnect();
				done();
			});
		});

		it("Sending incorrect params (request.data = null) -> should fire event err_InjectContentScriptByTabId",function(done){
			var socket = io(url, {forceNew: true });
			var sender = {
				tab : {
					id : 123
				}
			};
			var request = {
				data : null
			};
			var response = null;

			socket.emit(emitEventName, sender, request, response);

			socket.on(errOnEventName, function(){
				socket.disconnect();
				done();
			});
		});

		it("Sending incorrect params (request.data.homeName = null) -> should fire event err_InjectContentScriptByTabId",function(done){
			var socket = io(url, {forceNew: true });
			var sender = {
				tab : {
					id : 123
				}
			};
			var request = {
				data : {
					homeName : null,
					pageName : 'caixaHome'
				}
			};
			var response = null;

			socket.emit(emitEventName, sender, request, response);

			socket.on(errOnEventName, function(){
				socket.disconnect();
				done();
			});
		});


		it("Sending incorrect params (request.data.homeName = null) -> should fire event err_InjectContentScriptByTabId",function(done){
			var socket = io(url, {forceNew: true });
			var sender = {
				tab : {
					id : 123
				}
			};
			var request = {
				data : {
					homeName : 'CEF',
					pageName : null
				}
			};
			var response = null;

			socket.emit(emitEventName, sender, request, response);

			socket.on(errOnEventName, function(){
				socket.disconnect();
				done();
			});
		});

		
	});

});

