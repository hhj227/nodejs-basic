const express = require("express");
const router = express.Router();
const db = require("../config/db");
const template = require("../lib/template.js");
const cookie = require("cookie");

router.get("", (request, response) => {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        const title = 'Login';
        const list = template.list(request.body.list);
        const authIsOwner = template.authIsOwner(request, response);
        const authStatusUI = template.authStatusUI(authIsOwner);
        const html = template.HTML(title, list,
          `
          <form action="/login/login_process" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="submit"></p>
          </form>`,
          `<a href="/create">create</a>`,
          authStatusUI);
        // const html = `<head>hi</head><body><h1>this is test</h1></body>`;
        response.send(html);
    });
});

router.post("/login_process", (request, response)=>{
    const post = request.body;
    // console.log("enter login process");
    if(post.email === 'egoing777@gmail.com' && post.password === '111111') {
        response.cookie('email',`${post.email}`, {encode: String});
        response.cookie('password',`${post.password}`);
        response.cookie('nickname','egoing');
        response.redirect(`/`);
    }else {
      response.send("who?");
    }
});

router.post("/logout_process", (request, response)=>{
  // console.log("enter login process");
      response.cookie('email', maxAge=0);
      response.cookie('password',maxAge=0);
      response.cookie('nickname',maxAge=0);
      response.redirect(`/`);
});

module.exports = router;