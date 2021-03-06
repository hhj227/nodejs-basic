const cookie = require('cookie');

module.exports = {
    HTML:function(title, list, body, control, authStatusUI){
      return `
      <!doctype html>
      <html>
      <head>
      <!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-145406174-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-145406174-1');
</script>

        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
      ${authStatusUI}
        <h1><a href="/">WEB</a></h1>
        <a href="/author">author</a>
        ${list}
        ${control}
        ${body}
      </body>
      </html>
      `;
    },
   list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/topic/${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },
    authorSelect:function(authors, author_id){
      var tag = '';
          var i = 0;
          while(i<authors.length){
            var selected = '';
            if(authors[i].id === author_id){
              selected = ' selected';
            }
            tag+=`<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
            i++;
          }
          return `<select name="author">
          ${tag}
        </select>`;
    },
    authorTable:function(authors){
      var tag = '<table>';
            var i = 0;
            while(i<authors.length){
                tag += `
                <tr>
                    <td>${authors[i].name}</td>
                    <td>${authors[i].profile}</td>
                    <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                    <td>
                    <form action="/author/delete_process" method="post">
                    <input type="hidden" name="id" value="${authors[i].id}">
                    <input type="submit" value="delete">
                    </form>
                    </td>
                </tr>
                `;
                i++
            }
            tag+='</table>';

            return tag;
    },
    authIsOwner:function(request, response) {
      var isOwner = false;
      var cookies = {};
      if(request.headers.cookie){
        cookies = cookie.parse(request.headers.cookie);
      }
      if(cookies.email === 'egoing777@gmail.com' && cookies.password === '111111'){
        isOwner = true;
      }
      return isOwner;
    },
    authStatusUI:function(authIsOwner) {
      var authStatusUI = '<a href="/login">login</a>';
      if (authIsOwner) {
        authStatusUI = '<a href="/logout_process">logout</a>';
      }
      return authStatusUI;
    }
  }
