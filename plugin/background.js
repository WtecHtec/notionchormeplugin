// chrome.action.onClicked.addListener(function (tab) {
//     sendMessageToContentScript({ cmd: 'wtc_cr_cmd', value: 'cr' }, function (response) {
//         console.log('来自content的回复：' + response);
//     });
// });

// function sendMessageToContentScript(message, callback) {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
//             if (callback) callback(response);
//         });
//     });
// }

console.log('back groud js')

function gotoAuth() {
	chrome.tabs.create({ url: 'https://api.notion.com/v1/oauth/authorize?client_id=a25d280e-fccf-48a6-8ad2-c147f07c9d4d&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fsr7.top%2Fnotion%2Fauth' });
}

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message) {
		console.log(`收到消息：${request.message}`);
		gotoAuth()
		// 发送响应到 popup
		// sendResponse({ message: 'Hello from background!' });
	}
});



let parent = chrome.contextMenus.create({
	title: '便签：NNote笔记',
	id: 'parent',
	contexts: ['selection'],
});

// chrome.contextMenus.create({
// 	title: '前往授权Notion',
// 	parentId: 'parent',
// 	id: 'auth',
// 	contexts: ['selection'],
// });


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.url) {
		console.log('Tab updated with new URL:', changeInfo.url);
		if (changeInfo.url === 'https://sr7.top/notion/authorizationsuccessful') {
			chrome.cookies.getAll({ domain: 'sr7.top' }, function (cookie) {
				console.log('cookie---', cookie)
				cookie.forEach(function (c) {
					console.log(c.name, c.value);
				});
			});
		}
	}
});


chrome.contextMenus.onClicked.addListener(function (info, tab) {
	console.log('info---', info)
	switch (info.menuItemId) {
		case 'auth':


			break;
	}
});

