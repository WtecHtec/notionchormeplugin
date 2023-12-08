const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const axios = require('axios')
const { Client } = require("@notionhq/client")

const clientId = 'a25d280e-fccf-48a6-8ad2-c147f07c9d4d';
const clientSecret = 'secret_xkvkEXo0OCk63UAelxeXGjByZCG6mmt4G8xSvM7Vh0j';
const redirectUri = 'https://sr7.top/notion/auth';

const port = 4389

// encode in base 64
const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

const app = express()
app.use(cors())
app.use(bodyParser.json());

/** 获取auth token */
async function getAuthToken(code) {
  const response = await axios.post("https://api.notion.com/v1/oauth/token", {
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  }, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${encoded}`,
    },
  });
  return response
}

// code=03d8ee11-1a42-48f1-9099-bdeb81246cd1&state=
app.get('/auth', async (req, res) => {
  const params = req.query
  console.log(JSON.stringify(params))
  try {
    const response = await getAuthToken(params.code)
    console.log(response.data)
    res.setHeader('Set-Cookie', [`access_token=${response.data.access_token}`])
    res.redirect('/notion/authorizationsuccessful')
  } catch (error) {
    console.log(error)
    res.redirect('/notion/authorizationfailed')
  }
})

/**
 * Authorization failed Authorization successful
 */
app.get('/authorizationfailed', (req, res) => {
  res.send('授权失败')
})

app.get('/authorizationsuccessful', (req, res) => {
  res.send('授权成功')
})

// 获取列表
// Initializing a client
app.post('/wrnote', async (req, res) => {
  console.log(req.body)
  const { auth } = req.body;
  const notion = new Client({
    auth,
  })
  // try {
  //   const listUsersResponse = await notion.users.list({})
  //   console.log(listUsersResponse)
  //   res.send(listUsersResponse)
  // } catch (error) {
  //   console.log(error)
  //   res.send(error)
  // }



  const blockId = '51c6ebf013184457ae2cb2775b4e3a05';
  const response = await notion.blocks.children.append({
    block_id: blockId,
    children: [
      {
        "heading_2": {
          "rich_text": [
            {
              "text": {
                "content": "Lacinato kadd大苏打撒大大撒旦撒大苏打le"
              }
            }
          ]
        }
      },
      {
        "paragraph": {
          "rich_text": [
            {
              "text": {
                "content": "Lacinato kale is a variety of kale with a long tradition in Italian cuisine, especially that of Tuscany. It is also known as Tuscan kale, Italian kale, dinosaur kale, kale, flat back kale, palm tree kale, or black Tuscan palm.",
                "link": {
                  "url": "https://en.wikipedia.org/wiki/Lacinato_kale"
                }
              }
            }
          ]
        }
      }
    ],
  });
  console.log(response);

  res.send(response)
  /**
   * {
  access_token: 'secret_thPnvEm09AeThrUjGaltLeQ2oYhYJtoAp7oiZxC64Up',
  token_type: 'bearer',
  bot_id: '644dc266-c5f9-4628-a986-a0a94ecf2396',
  workspace_name: 'herzshen的 Notion',
  workspace_icon: null,
  workspace_id: '59375d7a-fb1b-4287-bb9e-646166da25e0',
  owner: {
    type: 'user',
    user: {
      object: 'user',
      id: '61c5c1d7-9b97-478b-baf8-b2829f21c4d5',
      name: 'herzshen',
      avatar_url: null,
      type: 'person',
      person: [Object]
    }
  },
  duplicated_template_id: null,
  request_id: 'e2273926-7562-4ffc-b5a3-ca72cf8036f5'
}
   */

//   const response = await notion.pages.create({
//     "cover": {
//         "type": "external",
//         "external": {
//             "url": "https://upload.wikimedia.org/wikipedia/commons/6/62/Tuscankale.jpg"
//         }
//     },
//     "icon": {
//         "type": "emoji",
//         "emoji": "🥬"
//     },
//     "parent": {
//         "type": "page_id",
//         "page_id": "51c6ebf013184457ae2cb2775b4e3a05"
//     },
//     "properties": {
//         "Description": {
//             "rich_text": [
//                 {
//                     "text": {
//                         "content": "A dark green leafy vegetable"
//                     }
//                 }
//             ]
//         },
//         "Food group": {
//             "select": {
//                 "name": "🥬 Vegetable"
//             }
//         }
//     },
//     "children": [
//         {
//             "object": "block",
//             "heading_2": {
//                 "rich_text": [
//                     {
//                         "text": {
//                             "content": "Lacinato kale"
//                         }
//                     }
//                 ]
//             }
//         },
//         {
//             "object": "block",
//             "paragraph": {
//                 "rich_text": [
//                     {
//                         "text": {
//                             "content": "Lacinato kale is a variety of kale with a long tradition in Italian cuisine, especially that of Tuscany. It is also known as Tuscan kale, Italian kale, dinosaur kale, kale, flat back kale, palm tree kale, or black Tuscan palm.",
//                             "link": {
//                                 "url": "https://en.wikipedia.org/wiki/Lacinato_kale"
//                             }
//                         },
//                         "href": "https://en.wikipedia.org/wiki/Lacinato_kale"
//                     }
//                 ],
//                 "color": "default"
//             }
//         }
//     ]
// });
//   console.log(response);


})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})