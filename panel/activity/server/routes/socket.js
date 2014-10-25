'use strict';

var fs = require('fs');
var appPath = process.cwd();
var fs = require('fs');
var path = require('path');

module.exports = function(app, io, db){

	var activityUsers = require('../models/activityUsers')();

	io.of('/panel').on('connection', function(){
		console.log('novo usuario conectado /panel');
	});
	// // #Sockets
	io.on('connection', function(socket){
		
		process.on('common_pulseConnectionPage', function(socketId, sender, request, response){
			// Checking receptor message is a really truth recpetor
			if(socketId != socket.id) return;

			var tab = sender.tab;
			var pageName = request.data.pageName;

			var data = {
				socketId : socketId,
				tab : tab,
				pageName : pageName
			};

			
			activityUsers.add(data);
			io.of('/panel').emit('updateActivityUser', data);
			
		});


		socket.on('getTabsBySocketId', function(socketId){
			activityUsers.getTabsBySocketId(socketId, function(err, _data){
				io.of('/panel').emit('getTabsBySocketId', _data);
			});
		});

		socket.on('onTabRemoved', function(tabId){
			if(!tabId) return;

			var data = {
				socketId : socket.id, 
				tabId : tabId
			}
			activityUsers.removeTabById(data);
			io.of('/panel').emit('onTabRemoved', data);
		});


		socket.on('disconnect', function(){
			activityUsers.getTabsBySocketId(socket.id,function(data){
				io.of('/panel').emit('onTabRemoved', data);
			});
			activityUsers.removeBySocketId(socket.id);
		});

		


	});


};
