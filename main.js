const express = require("express");
const compression = require("compression");
const defaultRouter = require('./routes/default');
const topicRouter = require("./routes/topic");
const indexRouter = require("./routes/index");
const authorRouter = require("./routes/author");
const loginRouter = require("./routes/login");
const helmet = require("helmet");
const looger = require('morgan');
const path = require('path');
const app = express();

// view engine
// app.use('views', path.join(__dirname, 'views'));
//app.set("view engine", "pug");

// custom middleware
app.use(looger('dev'));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(helmet());

//default -> index ok
//index -> topic error
app.use("*", defaultRouter);
app.use("/", indexRouter);
app.use("/topic", topicRouter);
app.use('/author', authorRouter);
app.use('/login', loginRouter);


// var app = http.createServer((request,response) => {
//     if(pathname==='/create'){
//       topic.create(request, response);
//     } 
//     else if(pathname==='/create_process'){
//       topic.create_process(request, response);
//     }
//     else if(pathname==='/update'){
//       topic.update(request, response);
//     }
//     else if(pathname==='/update_process'){
//       topic.update_process(request, response);
//     }
//     else if(pathname==='/delete_process'){
//       topic.delete_process(request, response);
//     }
//     else if(pathname==='/author'){
//       author.home(request, response);
//     }
//     else if(pathname==='/author/create_process'){
//       author.create_process(request, response);
//     }
//     else if(pathname==='/author/update'){
//       author.update(request, response);
//     }
//     else if(pathname === '/author/update_process'){
//       author.update_process(request, response);
//     }
//     else if(pathname==='/author/delete_process'){
//       author.delete_process(request, response);
//     }
    // else if(pathname==='/login'){
    //   fs.readdir('./data', function(error, filelist) {
    //     var title = "Login";
    //     var list = template.list(filelist);
    //     var html = template.HTML(title, list, 
    //       `
    //         <form action="login_process type="post">
    //           <p><input type="text" name="email" placeholder="email"></p>
    //           <p><input type="password" name="password" placeholder="password"></p>
    //           <p><input type="submit"></p>
    //         </form>
    //       `,
    //       `
    //         <a href="/create">create</a>
    //       `);
    //       response.writeHead(200);
    //       response.end(html);
    //   });
    // }
//     else {
//       response.writeHead(404);
//       response.end('Not found');
//     }
// });

app.use((req, res, next) => {
  res.status(404).send("Sorry cant find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});