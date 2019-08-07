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

module.exports = router;