'use strict';

var Should = require('should');
var io = require('socket.io-client');
var url = 'http://127.0.0.1:3005'


describe('COMMON ONTABUPDATED', function(){
	
	var emitEventName = 'onTabUpdated';
	var okOnEventName = 'common_onTabUpdated';
	var errOnEventName = 'common_err_onTabUpdated';

	it("Sending correct params -> should fire event "+okOnEventName,function(done){
		var socket = io(url, {forceNew: true });

		var tab = {
			url : 'http://examplename.com.br',
			id : 123
		};

		socket.emit(emitEventName, tab);

		process.on(okOnEventName, function(_socket, _tab){
			var socketId = _socket.id;
			if(socketId != socket.io.engine.id) return;

			Should(tab.id).be.exactly(_tab.id);
			socket.disconnect();
			done();
		});

		
	});

	it("Sending incorrect params (tab = null) -> should fire event "+ errOnEventName,function(done){
		var socket = io(url, {forceNew: true });

		var tab = null;

		socket.emit(emitEventName, tab);

		socket.on(errOnEventName, function(data){
			socket.disconnect();
			Should(data).be.exactly('incompleteTab');
			done();
		});

		
	});

	it("Sending incorrect params (tab.id = null) -> should fire event "+ errOnEventName,function(done){
		var socket = io(url, {forceNew: true });

		var tab = {
			url : 'http://examplename.com.br',
			id : null
		};

		socket.emit(emitEventName, tab);

		socket.on(errOnEventName, function(data){
			socket.disconnect();
			Should(data).be.exactly('incompleteTab');
			done();
		});
	});

	it("Sending incorrect params (tab.url = null) -> should fire event "+ errOnEventName,function(done){
		var socket = io(url, {forceNew: true });

		var tab = {
			url : null,
			id : 123
		};

		socket.emit(emitEventName, tab);

		socket.on(errOnEventName, function(data){
			socket.disconnect();
			Should(data).be.exactly('incompleteTab');
			done();
		});
	});



	
});


