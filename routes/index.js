const express = require('express');
const router = express.Router();
const template = require('../lib/template.js');

//route, routing
router.get('/', (request, response) => {  
    const title = 'Welcome';
    const description = 'Hello, Node.js';
    const list = template.list(request.body.list);
    const authIsOwner = template.authIsOwner(request, response);
    const authStatusUI = template.authStatusUI(authIsOwner);
    const html = template.HTML(title, list,
      `
      <h2>${title}</h2>${description}
      <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
      `,
      `<a href="/topic/create">create</a>`, authStatusUI
    ); 
    response.send(html);
  });

  module.exports = router;