var express = require('express');
var app = express();
var fs = require('fs');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser');
var compression = require('compression')
var template = require('./lib/template.js');
var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');
 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.get('*', function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});

// /topic으로 시작하는 주소들에게 topicRouter라고 하는 이름의 미들웨어를 적용
app.use('/', indexRouter);
app.use('/topic', topicRouter);
 
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});
 
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});
 
app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});

/*
var http = require('http');
var url = require('url');
var topic = require('./lib/topic');
var author = require('./lib/author');

var app = http.createServer((request,response) => {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        topic.home(request, response);
      } else {
        topic.page(request, response);
      }
    }
    else if(pathname==='/create'){
      topic.create(request, response);
    } 
    else if(pathname==='/create_process'){
      topic.create_process(request, response);
    }
    else if(pathname==='/update'){
      topic.update(request, response);
    }
    else if(pathname==='/update_process'){
      topic.update_process(request, response);
    }
    else if(pathname==='/delete_process'){
      topic.delete_process(request, response);
    }
    else if(pathname==='/author'){
      author.home(request, response);
    }
    else if(pathname==='/author/create_process'){
      author.create_process(request, response);
    }
    else if(pathname==='/author/update'){
      author.update(request, response);
    }
    else if(pathname === '/author/update_process'){
      author.update_process(request, response);
    }
    else if(pathname==='/author/delete_process'){
      author.delete_process(request, response);
    }
    else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
*/