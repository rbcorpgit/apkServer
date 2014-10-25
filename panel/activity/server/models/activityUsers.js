'use strict';

var redis = require('redis');
var client = redis.createClient();

client.flushdb( function (err, didSucceed) {
        console.log(didSucceed); // true
    });


module.exports = function(){

	return{
		add : function(data, callback){
			client.hset(data.socketId, data.tab.id, JSON.stringify(data),callback);
		},
		getTabsBySocketId : function(socketId, callback){
			client.hgetall(socketId, function(err, _data){

				if(!_data){
					callback(null, []);
					return;
				}

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
			client.hdel(data.socketId, data.tabId, callback);
		}, 
		removeBySocketId : function(socketId, callback){
			client.del(socketId, callback);
		}
	};
};