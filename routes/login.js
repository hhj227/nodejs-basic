const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const db = require("../config/db");
const url = require("url");
const template = require("../lib/template.js");

router.get("", (request, response) => {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        var title = 'Login';
        var list = template.list(request.body.list);
        var html = template.HTML(title, list,
          `
          <form action="login_process" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="submit"></p>
          </form>`,
          `<a href="/create">create</a>`
        );
        // var html = `<head>hi</head><body><h1>this is test</h1></body>`;
        response.send(html);
    });
});

router.post("/login_process", (request, response)=>{
    // var post = request.body;
    // console.log("enter login process");
    // if(post.email === 'egoing777@gmail.com' && post.password === '111111') {
    //     //   response.cookie('Set-Cookie', '1'
    //     //   );
    //       response.redirect(302, `/`);
    // }
    var body = '';
	      request.on('data', function(data){
	          body = body + data;
	      });
	      request.on('end', function(){
	          var post = qs.parse(body);
	          if(post.email === 'egoing777@gmail.com' && post.password === '111111') {
	            response.writeHead(302, {
	              'Set-Cookie':[
	                `email=${post.email}`,
	                `password=${post.password}`,
	                `nickname=egoing`
	              ],
	              Location: `/`
	            });
	          }
	          response.end();
	      });
});

// [`email=${post.email}`,
//           `password=${post.password}`,
//           `nickname=egoing`]
module.exports = router;