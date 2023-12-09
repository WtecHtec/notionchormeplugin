

// popup.js
// let PopupToBackgroundPort = chrome.extension.connect({ name: 'popup-background-link' })

// PopupToBackgroundPort.onMessage.addListener((message) => { console.log(message) })

const COOKIE_CONIGF = { 
  access_token: 0,
  duplicated_template_id: 0,
  notion_name: 0,
}

window.onload = () => {
  chrome.storage.sync.get({ ...COOKIE_CONIGF }, function(items) {
    console.log(items);
    const keys = Object.keys(COOKIE_CONIGF)
    const status = keys.some(key => items[key] === 0)
    if (status) {
      $('#authbt').show()
    } else {
      $('#showh').show()
      $('#showanme').text(items.notion_name)
    }
  });
}

$('#authbt').on('click', () => {
	console.log('authbt----')
	const bg = chrome.extension.getBackgroundPage()
	console.log(bg)
	// bg.gotoAuth()
	// PopupToBackgroundPort.postMessage({ type: 'gotoAuth' })
	// 发送消息到 background
	chrome.runtime.sendMessage({ type: 'gotoauth' }, (response) => {
		console.log(response);
	});
})

$('#swauth').on('click', () => {
  chrome.runtime.sendMessage({ type: 'gotoauth' }, (response) => {
		console.log(response);
	});
})