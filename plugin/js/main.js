chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	// console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
	if (request.cmd == 'wtc_cr_cmd') {
		$('#cr_opt_auto').css('display', 'block');
	}
	sendResponse('cr')
});

