'use strict';

var fs = require('fs');
var appPath = process.cwd();
var fs = require('fs');
var path = require('path');
var validator = require('../services/validator.js')();

/*
	Esta 'classe' é responsável pelo core da aplicação.
	Intermediária entre cliente e funções do servidor.
	Filtra dados enviados do cliente, verifica se estão
	de acordo com o padrão de dados e dá um broadcast
	via process para toda a aplicação;
*/

module.exports = function(app, io, db){


	/*
		Quando um novo usuário se conecta
	*/
	var users = 0;
	io.on('connection', function(socket){
		users++;
		console.log(users + ' conectados');
		/*
			Quando alguem se desconecta
		*/
		socket.on('disconnect', function(){
			users--;
			console.log(users + ' conectados');
			process.emit('common_disconnect',socket);
		});


		/*
			Quando alguem remove uma aba do browser
		*/
		socket.on('onTabRemoved', function(tabId){

			/*
				Checando conformidades
			*/
			if(!tabId){
				socket.emit('common_err_onTabRemoved','incompleteTab');
				return;
			}
			/*
				Broadcast para toda a aplicação
			*/
			process.emit('common_onTabRemoved',socket, tabId);
		});

		socket.on('onTabUpdated', function(tab){

			/*
				Checando conformidades
			*/
			if(!validator.validateTab(tab)){
				socket.emit('common_err_onTabUpdated','incompleteTab');
				return;
			}

			/*
				Broadcast para toda a aplicação
			*/
			process.emit('common_onTabUpdated',socket, tab);
		});

		socket.on('injectContentScript', function(sender, request, response){

			/*
				Checando conformidades
			*/
			if(!validator.validatorSender(sender)){
				socket.emit('common_err_injectContentScript','incompleteSender');
				return;
			}

			/*
				Checando conformidades
			*/
			if(!validator.validatorRequest(request)){
				socket.emit('common_err_injectContentScript','incompleteRequest');
				return;
			};

			/*
				Checando conformidades
			*/
			if(request.data.homeName == null){
				socket.emit('common_err_injectContentScript','incompleteHomeName');
				return;
			};

			/*
				Checando conformidades
			*/
			if(!request.data.pageName ){
				socket.emit('common_err_injectContentScript','incompletePageName');
				return;
			};

			/*
				Broadcast para toda a aplicação
			*/
			process.emit('common_injectContentScriptByTabId',socket, sender, request, response);


		});


		socket.on('pulseConnectionPage', function(sender, request, response){
			
			/*
				Checando conformidades
			*/
			if(!validator.validatorSender(sender)){
				socket.emit('common_err_pulseConnectionPage','incompleteSender');
				return;
			}

			/*
				Checando conformidades
			*/
			if(!validator.validatorRequest(request)){
				socket.emit('common_err_pulseConnectionPage','incompleteRequest');
				return;
			};

			/*
				Checando conformidades
			*/
			if(request.data.homeName == null){
				socket.emit('common_err_pulseConnectionPage','incompleteHomeName');
				return;
			};

			/*
				Checando conformidades
			*/
			if(!request.data.pageName ){
				socket.emit('common_err_pulseConnectionPage','incompletePageName');
				return;
			};

			/*
				Broadcast para toda a aplicação
			*/
			process.emit('common_pulseConnectionPage', socket, sender, request, response);

		});


	});

};
