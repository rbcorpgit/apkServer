var ioC = require('socket.io-client');
var sockets = [];
var i = 0;

// for(var i=0;i<10000;i++){
// 	//'http://104.131.115.101:3005'
// 	sockets[i] = ioC('http://localhost:3005', {forceNew: true });
// };

for(var x =0;x<10;x++){
	setInterval(function(){
		sockets[i] = ioC('http://localhost:3005', {forceNew: true });
		i++;
		console.log(i+' conectados');
	},1);
}

setInterval(function(){
	for(var i in sockets){
		sockets[i].emit('teste');
	}
},500);
