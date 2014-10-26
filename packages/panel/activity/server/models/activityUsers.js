'use strict';

var redis = require('redis');
var client = redis.createClient();

client.flushdb( function (err, didSucceed) {
        console.log(didSucceed); // true
    });


module.exports = function(){

	return{
		add : function(data, callback){
			console.log('adicionndoooooooooooooooo : '+data.socketId);
			client.hset(data.socketId, data.tab.id, JSON.stringify(data),callback);
		},
		getTabBySocketId : function(data, callback){
			var socketId = data.socketId;
			var tabId = data.tabId;

			client.hget(socketId, tabId, function(err, _data){
				callback(err, JSON.parse(_data));
			});

		},
		getTabsBySocketId : function(socketId, callback){
			client.hgetall(socketId, function(err, _data){
				console.log(_data);
				if(!_data){
					console.log('nao existe');
					callback(null, null);
					return;
				}

				console.log('existe');

				for(var i in _data){
					callback(err, JSON.parse(_data[i]));
				}
				
			});
		},
		getTabsByAll : function(callback){
			var _this = this;
			client.keys('*', function(err, data){
				for(var i in data){
					_this.getTabsBySocketId(data[i], function(err, _data){
						console.log(_data);
					});
				}
			});
		},
		removeTabById : function(data, callback){
			console.log('removendoooooooooooooo tabela : '+data.socketId);
			client.hdel(data.socketId, data.tabId, callback);
		}, 
		removeBySocketId : function(socketId, callback){
			console.log('removendoooooooooooooo tudo : '+socketId);
			client.del(socketId, callback);
		}
	};
};