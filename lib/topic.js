var db = require('./db');
var template = require('./template');
var url = require('url');
var qs = require('querystring');

exports.home = (request, response) => {
    db.query(`SELECT * FROM topic`, (error,topics) => {
    if(error){
        throw error;
    }
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(topics);
    var html = template.HTML(title, list, 
        `<h2>${title}</h2><p>${description}</p>`,
    `<a href="/create">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  });
}

exports.page = (request, response) => {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, (error,topics) => {
        // 에러가 생기면 바로 함수 중지
        if(error){
          throw error;
        }
        // id를 배열에 담아서 전달. 공격 의도가 있는 코드는 세탁
        db.query(`select * from topic left join author on topic.author_id=author.id where topic.id=?`, [queryData.id], (error2, topic) => {
          if(error2){
            throw error2;
          }
         //  console.log(topic);
         var title = topic[0].title;
         var description = topic[0].description;
         var list = template.list(topics);
         var html = template.HTML(title, list,
           `<h2>${title}</h2>${description}
           <p>by ${topic[0].name}</p>`,
           ` <a href="/create">create</a>
             <a href="/update?id=${queryData.id}">update</a>
             <form action="delete_process" method="post">
               <input type="hidden" name="id" value="${queryData.id}">
               <input type="submit" value="delete">
             </form>`
         );
         response.writeHead(200);
       response.end(html);
        });        
     });
}
exports.create = (request, response) => {
    db.query(`SELECT * FROM topic`, (error,topics) => {
        if(error){
            throw error;
        }
        db.query(`SELECT * FROM author`, (error2,authors) => {
            if(error2){
                throw error2;
            }
          var title = 'Create';
        var list = template.list(topics);
        var html = template.HTML(title, list, 
          `<form action="/create_process" method="post">
          <p>
              <input type="text" name="title" placeholder="title">
          
          </p>
          <p>
              <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
              ${template.authorSelect(authors)}
          </p>
          <p>
              <input type="submit">
          </p>
          </form>`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
        });
      });
}
exports.create_process = (request, response) => {
    var body = '';
      request.on('data', data => {
        body = body + data;
      });
      request.on('end', () => {
        var post = qs.parse(body);
        // query가 끝나면 콜백함수
        // author_id 나중에 수정
        db.query(`
        INSERT INTO topic (title, description, created, author_id) 
        VALUES (?, ?, NOW(), ?)`,
        [post.title, post.description, post.author],
        function(error, result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/?id=${result.insertId}`});
          response.end();
        }
        )
      });
}
exports.update = (request, response) => {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, (error, topics) => {
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic where id=?`, [queryData.id], (error2, topic) =>{
          if(error2){
            throw error2;
          }
          db.query(`SELECT * FROM author`, (error3, authors) => {
            if(error3){
              throw error3;
            }
            var list = template.list(topics);
            var html = template.HTML(topic[0].title, list, 
              `<form action="/update_process" method="post">
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
            `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`);
            response.writeHead(200);
            response.end(html);
          });
        });
      });
}

exports.update_process = (request, response) => {
    var body = '';
      request.on('data', data => {
        body = body + data;
      });
      request.on('end', () => {
        var post = qs.parse(body);
        console.log(post);
        db.query(`
        UPDATE topic SET title = ?, description = ?, author_id = ? WHERE id = ?`,
        [post.title, post.description, post.author, post.id],
        (error, result) => {
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/?id=${post.id}`});
          response.end();
        }
        )

      });
}

exports.delete_process = (request, response) => {
    var body = '';
      request.on('data', (data) => {
          body = body + data;
      });
      request.on('end', () => {
          var post = qs.parse(body);
          /*fs.unlink(`data/${filteredId}`, function(error){
            response.writeHead(302, {Location: `/`});
            response.end();
          })*/
          db.query(`DELETE FROM topic WHERE id=?`, [post.id], (error) => {
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/`});
            response.end();
          });
      });
}