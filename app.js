var http = require('http'); //module for sending http request

http.createServer(function (req, res) { 
  res.writeHead(200, {'Content-Type': 'text/plain'}); //status code
  res.end('Hello World!');
}).listen(8080); //server port