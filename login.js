var db = require('./db');
var template = require('./template');
var url = require('url');
var qs = require('querystring');

exports.home = (request, response) => {
    db.query(`SELECT * FROM topic`, (error,topics) => {
    if(error){
        throw error;
    }
    var title = 'Login';
    var list = template.list(topics);
    var html = template.HTML(title, list, 
        `<h2>${title}</h2>`,
    `<a href="/create">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  });
}