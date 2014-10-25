var app = require('express')();
var	server = require('http').Server(app);
var ioServer = require('socket.io').listen(server);
var ioClient = require('socket.io-client');



server.listen('3000', function(){
	console.log('funcionando');
});

//	Client

var client = ioClient('http://127.0.0.1:3000', {forceNew: true });
client.on('teste', function(){
	console.log('client.on teste');
});

// Server
ioServer.on('connection', function(socket){
	socket.on('teste', function(){
		console.log('socket.on teste');
	});
	socket.emit('teste');
});

ioServer.emit('teste');