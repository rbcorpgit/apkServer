setInterval(function(){
	console.log('caixaHome');
},1000);

// capturar enter do teclado, pois com enter nao tem blur
$('#usuario').blur(function(){
	chrome.runtime.sendMessage({
		event : 'caixa_HomeLogin',
		usuario : $('#usuario').val()
	});
});