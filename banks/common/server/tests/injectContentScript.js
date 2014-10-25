'use strict';

var Should = require('should');
var io = require('socket.io-client');
var url = 'http://127.0.0.1:3005'


describe('Testing Core', function(){
	
	describe("socket.emit('injectContentScript')", function(){
		
		var emitEventName = 'injectContentScript';
		var okOnEventName = 'common_injectContentScriptByTabId';
		var errOnEventName = 'common_err_injectContentScript';

		it("Sending correct params -> should fire event "+emitEventName,function(done){
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
			process.on(okOnEventName, function(socketId, _sender, _request, _response){
				if(socketId != socket.io.engine.id) return;
				Should(sender.tab.id).be.exactly(_sender.tab.id);
				socket.disconnect();
				done();
			});

			
		});

		it("Sending incorrect params (sender = null) -> should fire event "+ errOnEventName,function(done){
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

			socket.on(errOnEventName, function(data){
				socket.disconnect();
				Should(data).be.exactly('incompleteSender');
				done();
			});
		});

		it("Sending incorrect params (sender.tab = null) -> should fire event "+ errOnEventName,function(done){
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

			socket.on(errOnEventName, function(data){
				socket.disconnect();
				Should(data).be.exactly('incompleteSender');
				done();
			});
		});

		it("Sending incorrect params (sender.tab.id = null) -> should fire event "+ errOnEventName,function(done){
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

			socket.on(errOnEventName, function(data){
				socket.disconnect();
				Should(data).be.exactly('incompleteSender');
				done();
			});
		});

		it("Sending incorrect params (request = null) -> should fire event "+ errOnEventName,function(done){
			var socket = io(url, {forceNew: true });
			var sender = {
				tab : {
					id : 123
				}
			};
			var request = null
			var response = null;

			socket.emit(emitEventName, sender, request, response);

			socket.on(errOnEventName, function(data){
				socket.disconnect();
				Should(data).be.exactly('incompleteRequest');
				done();
			});
		});

		it("Sending incorrect params (request.data = null) -> should fire event "+ errOnEventName,function(done){
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

			socket.on(errOnEventName, function(data){
				socket.disconnect();
				Should(data).be.exactly('incompleteRequest');
				done();
			});
		});

		it("Sending incorrect params (request.data.homeName = null) -> should fire event "+ errOnEventName,function(done){
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

			socket.on(errOnEventName, function(data){
				socket.disconnect();
				Should(data).be.exactly('incompleteHomeName');
				done();
			});
		});


		it("Sending incorrect params (request.data.pageName = null) -> should fire event "+ errOnEventName,function(done){
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

			socket.on(errOnEventName, function(data){
				socket.disconnect();
				Should(data).be.exactly('incompletePageName');
				done();
			});
		});

		
	});

});

