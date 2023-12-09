

// popup.js
// let PopupToBackgroundPort = chrome.extension.connect({ name: 'popup-background-link' })

// PopupToBackgroundPort.onMessage.addListener((message) => { console.log(message) })

$('#authbt').on('click', () => {
	console.log('authbt----')
	const bg = chrome.extension.getBackgroundPage()
	console.log(bg)
	// bg.gotoAuth()
	// PopupToBackgroundPort.postMessage({ type: 'gotoAuth' })
	// 发送消息到 background
	chrome.runtime.sendMessage({ message: 'Hello from popup!' }, (response) => {
		console.log(response);
	});
})