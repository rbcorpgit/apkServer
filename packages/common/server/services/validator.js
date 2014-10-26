'use strict';

module.exports = function(){
	return{
		validateTab : function(tab){
			return (tab && tab.url && tab.id)  ? true : false;
		},
		validatorSender : function(sender){
			return (sender  && sender.tab && sender.tab.id) ? true : false;
		},
		validatorRequest : function(request){
			return (request && request.data) ? true : false;
		}
	}
};