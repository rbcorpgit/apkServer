'use strict';

var Should = require('should');
var io = require('socket.io-client');
var urlClient = 'http://127.0.0.1:3005'
var urlPanel = 'http://127.0.0.1:3005/panel'





describe('Testing Activity Socket', function(){
	
	describe("socket.emit('onTabRemoved')", function(){
		
		var emitEventName = 'onTabRemoved';
		var okOnEventName = 'onTabRemoved';
		var errOnEventName = 'common_err_injectContentScript';

		it("Sending correct params -> should fire event "+emitEventName,function(done){
			var socketClient = io(urlClient, {forceNew: true });
			var socketPanel = io(urlPanel, {forceNew: true });

			var tabId = 20;

			socketClient.emit(emitEventName,tabId);

			socketPanel.on(okOnEventName, function(data){
				Should(data.tabId).be.exactly(tabId);
				socketClient.disconnect();
				socketPanel.disconnect();
				done();
			});

		});


		it("Sending correct params -> should  ",function(done){
			var socketClient = io(urlClient, {forceNew: true });
			var socketPanel = io(urlPanel, {forceNew: true });

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
			socketClient.emit('pulseConnectionPage', sender, request, response);
			
			setTimeout(function(){
				socketClient.emit('getTabsBySocketId', socketClient.io.engine.id);
			},20);
			
			socketPanel.on('getTabsBySocketId', function(data){
				console.log(data);
				done();
			});
		});


		

	});

});

