let http = require('http');
let fs = require('fs');
let urlParse = require('url');
const port = 8000;
const {parse} = require('querystring');

http.createServer((request,response) => {
    let filePath = './login.html';
    const {method,url}= request;
    console.log(url, method);
    let q = urlParse.parse(url, true).query;
    let pathName = urlParse.parse(url, true).pathname; 
    console.log(pathName);
    if (pathName === '/') // if homepage: http://localhost:8000
    {
        fs.readFile(filePath,  (error, content) => { // send the home page back to the user
            // use the fs package to read the file index.html from the local drive
            if (error){
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found");
                 throw error;
            }
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.end(content, 'utf-8');
        });
    }else if(pathName === '/mainPage'){
            if(request.method === 'POST'){
                console.log('We got post');
                let body = '';
                request.on('data', chunk => {
                    body += chunk.toString();
                    console.log(body);
                })
                request.on('end', () => {
                    let items = parse(body);
                    console.log(items);
                    if(items.username === 'admin' && items.password === 'sunny'){
                        fs.readFile('./mainPage.html', function (error, content) { 
                            if (error) {
                                res.writeHead(404, {'Content-Type': 'text/html'});
                                return res.end("404 Not Found");
                                throw error
                            };
                            response.writeHead(200, {
                                'Content-Type': 'text/html'
                            });
                            response.end(content, 'utf-8');
                        });
                    }else {
                        fs.readFile('./accessdenied.html', function (error, content) { 
                            if (error) throw error;
                            response.writeHead(401, {
                                'Content-Type': 'text/html'
                            });
                            response.end(content, 'utf-8');
                        });
                    }
                });
            }
    }else {
        console.log('We got Error');
        fs.readFile('./fileNotFound.html', function (error, content) { 
            if (error) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found");
                throw error
            };
            response.writeHead(404, {
                'Content-Type': 'text/html'
            });
            response.end(content, 'utf-8');
        });
    }
}).listen(port,message);

function message(){
    console.log(`Hello From Node js at server running at http://127.0.0.1:${port}/`);
}

// function css(request, response) {
//     if (request.url === '/styles.css') {
//       response.writeHead(200, {'Content-type' : 'text/css'});
//       var fileContents = fs.readFile('styles.css', {encoding: 'utf8'});
//       response.write(fileContents);
//     }
//   }  