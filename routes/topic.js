const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../config/db");
const template = require("../lib/template.js");

router.get("/create", (request, response) => {
  db.query(`SELECT * FROM topic`, (error, topics) => {
    if (error) throw error;
    db.query(`SELECT * FROM author`, (error2, authors) => {
      if (error2) throw error2;
      const title = "WEB - create";
      const list = template.list(topics);
      const authIsOwner = template.authIsOwner(request, response);
      const authStatusUI = template.authStatusUI(authIsOwner);
      const html = template.HTML(
        title,
        list,
        `
      <form action="/topic/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          ${template.authorSelect(authors)}
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `,
        "", authStatusUI
      );
      response.send(html);
    });
  });
});

router.post("/create_process", (request, response) => {
  const post = request.body;
  const title = post.title;
  const description = post.description;
  const author = post.author;
  //insert 완료
  db.query(
    `INSERT INTO topic (title, description, created, author_id) 
    VALUES (?, ?, NOW(), ?)`,
    [title, description, author],
    (error, result) => {
      if (error) throw error;
      response.redirect(`/?id=${result.insertId}`);
    }
  );
});

router.get("/update/:pageId", (request, response) => {
  const filteredId = path.parse(request.params.pageId).base;
  db.query(`SELECT * FROM topic`, (error, topics) => {
      if(error){
        throw error;
      }
      db.query(`SELECT * FROM topic WHERE id=?`, [filteredId], (error2, topic)=>{
        if(error2){
          throw error2;
        }
        db.query(`SELECT * FROM author`, (error3, authors) => {
          if(error3){
            throw error3;
          }
          console.log(topic);
          const list = template.list(topics);
          const authIsOwner = template.authIsOwner(request, response);
          const authStatusUI = template.authStatusUI(authIsOwner);
          const html = template.HTML(topic[0].title, list,
            `<form action="/topic/update_process" method="post">
            <input type="hidden" name="id" value="${topic[0].id}">
            <p>
                <input type="text" name="title" placeholder="title" value="${topic[0].title}">
            
            </p>
            <p>
                <textarea name="description" placeholder="description">${topic[0].description}</textarea>
            </p>
            <p>
                  ${template.authorSelect(authors, topic[0].author_id)}
            </p>
            <p>
                <input type="submit">
            </p>
            </form>`, 
            `<a href="/create">create</a> <a href="/update?id=${filteredId}">update</a>`, authStatusUI);
          // const html = `<head>d</head><body><h1>hello</h1></body>`;          
            response.send(html);
        });
      });
  });
});

router.post("/update_process", function(request, response) {
  const post = request.body;
  const id = post.id;
  const title = post.title;
  const description = post.description;
  db.query(`UPDATE topic SET title = ?, description = ?, author_id = ? WHERE id = ?`,
  [post.title, post.description, post.author, post.id],
  (error, result) => {
    if(error){
      throw error;
    }
    response.redirect(302, `/?id=${post.id}`);
  }
  );
});

router.post("/delete_process", function(request, response) {
  const post = request.body;
  const id = post.id;
  const filteredId = path.parse(id).base;
  db.query(`DELETE FROM topic WHERE id = ?`, [id], (error, result) => {
    if(error){
      throw error;
    }
    response.redirect("/");
  })
});

router.get("/:pageId", (request, response) => {
  const filteredId = path.parse(request.params.pageId).base;
  db.query(`SELECT * FROM topic`, (error, topics) => {
    if (error) throw error;
    db.query(
      `SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,
      [filteredId],
      (error2, topic) => {
        if (error2) throw error2;
        const title = topic[0].title;
        const description = topic[0].description;
        const list = template.list(request.body.list);
        const authIsOwner = template.authIsOwner(request, response);
        const authStatusUI = template.authStatusUI(authIsOwner);
        const html = template.HTML(
          title,
          list,
          `<h2>${title}</h2>${description}
          <p>by ${topic[0].name}</p>`,
          `<a href="/topic/create">create</a>
          <a href="/topic/update/${filteredId}">update</a>
          <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${filteredId}">
            <input type="submit" value="delete">
          </form>`, authStatusUI
        );
        response.send(html);
      }
    );
  });
});

module.exports = router;
