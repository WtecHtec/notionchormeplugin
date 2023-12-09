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

const COOKIE_CONIGF = { 
  access_token: 1,
  duplicated_template_id: 1,
  notion_name: 1,
}

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.type === 'gotoauth') {
		console.log(`收到消息：${request.type}`);
		gotoAuth()
		// 发送响应到 popup
		sendResponse({ message: 'Hello from background!' });
	}
});



let parent = chrome.contextMenus.create({
	title: '便签：NNote笔记',
	id: 'wrnote',
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
        const storageData = {
          ...COOKIE_CONIGF
        }

				cookie.forEach(function (c) {
          const { name, value } = c
          if (storageData[name]) {
            storageData[name] = value
          }
					console.log(c.name, c.value);
				});
        chrome.storage.sync.set({...storageData});
			});
		}
	}
});


chrome.contextMenus.onClicked.addListener(function (info, tab) {
	console.log('info---', info)
	switch (info.menuItemId) {
		case 'wrnote':
      const { selectionText, pageUrl } = info
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {   
        if (tabs.length > 0) {         
          const { title } = tabs[0];  
          chrome.storage.sync.get({ ...COOKIE_CONIGF }, function(items) {
            console.log(items);
            const postData = {
              auth: items.access_token, 
              template_id: items.duplicated_template_id, 
              content: selectionText,
              formTitle: title,
              formUrl: pageUrl,
            }
            postWrNote(postData)
          });
        } 
      });
			break;
	}
});


let $ = null
chrome.runtime.onInstalled.addListener(function() {
  console.log("Extension installed.", fetch);
  // 引入jQuery库
 
  
});
function postWrNote(postData) {
    // // 发送 POST 请求
    // $.ajax({
    //   url: "", // 替换为你的 API 接口地址
    //   type: "POST",
    //   data: JSON.stringify(postData),
    //   contentType: "application/json; charset=utf-8",
    //   dataType: "json",
    //   success: function(response) {
    //     // 请求成功后执行的代码
    //     console.log("请求成功，返回的数据：", response);
    //   },
    //   error: function(xhr, textStatus, errorThrown) {
    //     // 请求失败后执行的代码
    //     console.log("请求失败，错误信息：", textStatus, errorThrown);
    //   }
    // });

    // 发送 POST 请求
  fetch("https://sr7.top/notion/wrnote", { // 替换为你的 API 接口地址
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(postData)
  })
  .then(data => {
    // 请求成功后执行的代码
    console.log("请求成功，返回的数据：", data);
  })
  .catch(error => {
    // 请求失败后执行的代码
    console.error("请求失败，错误信息：", error);
  });
}

