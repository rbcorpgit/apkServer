'use strict';

var fs = require('fs');
var appPath = process.cwd();
var fs = require('fs');
var path = require('path');

/*
	Esta 'classe' é responsável por todos os interesses
	do panel do operador
*/

module.exports = function(app, io, db){

	/*
		Model responsável por CRUD no redis dos usuários 
		em atvidade
	*/
	var activityUsers = require('../models/activityUsers')();

	/*
		Quando um operador se conecta
	*/

	io.of('/panel').on('connection', function(socket){


		/*
			Quando o usuário carrega uma página,
			este evento verifica se era uma página
			em atividade, se sim, emite  onTabRemoved
			ao painel, retirando a aba da visão
		*/

		process.on('common_onTabUpdated', function(_socket, tab){
			var socketId = _socket.id;
			var hostName = tab.url.split('/')[2];
			var data = {
				socketId : socketId, 
				tabId : tab.id,
				hostName : hostName
			}

			activityUsers.getTabBySocketId(data, function(err, _data){
				if(!_data) return;

				if(_data.hostName == data.hostName) return;

				activityUsers.removeTabById(data);
				socket.emit('onTabRemoved', data);

			})
		});

		/*
			Este evento é emitido em um intervalo de tempo ao painel
			para checar se o usuário permanece na página ou modifica.
			Adiciona ao activityUsers a nova ou alteração da aba.
	
		*/
		process.on('common_pulseConnectionPage', function(_socket, sender, request, response){
			var socketId = _socket.id;

			var tab = sender.tab;
			var pageName = request.data.pageName;
			var homeName = request.data.homeName;
			var hostName = tab.url.split('/')[2];

			var data = {
				socketId : socketId,
				tab : tab,
				pageName : pageName,
				homeName : homeName,
				hostName : hostName
			};

			
			activityUsers.add(data);
			socket.emit('updateActivityUser', data);
			
		});

		/*
			Emite ao operador do painel que uma aba foi
			removida.
		*/
		process.on('common_onTabRemoved', function(_socket, tabId){

			var socketId = _socket.id;

			var data = {
				socketId : socketId, 
				tabId : tabId
			}

			activityUsers.removeTabById(data);
			socket.emit('onTabRemoved', data);
		});

		/*
			Envia painel todas as abas em atividade aos quais o
			usuário estava conectado
		*/
		process.on('common_disconnect', function(_socket){
			var socketId = _socket.id;

			activityUsers.getTabsBySocketId(socketId,function(err, data){
				if(data)
					socket.emit('onTabRemoved', data);
			});

			activityUsers.removeBySocketId(_socket.id);
		});

		/*

		*/
		// socket.on('getTabsBySocketId', function(_socket, callback){
		// 	var socketId = _socket.id;
		// 	activityUsers.getTabsBySocketId(socketId, function(err, _data){
		// 		callback(err, _data);
		// 	});
		// });

		
		
	});



};
