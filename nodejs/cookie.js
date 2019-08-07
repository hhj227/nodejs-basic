var http = require('http');
var cookie = require('cookie');
http.createServer(function(request, response){
    console.log(request.headers.cookie);
    var cookies = {};
    if(request.headers.cookie !== undefined){
        cookies = cookie.parse(request.headers.cookie);
    }
    // 실행 후에 주석처리하고 다시 리로드해도 쿠키값이 남아있다
    // permanent cookie 수명 30일
    response.writeHead(200, {
        'Set-Cookie' : [
            'yummy_cookie=choco',
            'tasty_cookie=strawberry',
        `permanent=coookies; Max-Age=${60*60*24*30}`,
        'Secure=Secure; Secure',
            'HttpOnly=HttpOnly; HttpOnly',
            'Path=Path; Path=/cookie',
            'Domain=Domain; Domain=o2.org'
    ]
    });
    console.log(cookies.yummy_cookie);
    response.end('cookie!');
}).listen(3000);