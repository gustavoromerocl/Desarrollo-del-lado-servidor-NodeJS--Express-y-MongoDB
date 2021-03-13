var express = require('express');

var app = express();

app.get('/', function(req, res) {
 res.send('Hola Mundo!');
});

app.listen(3000, function() {
 console.log('Aplicación ejemplo, escuchando el puerto 3000!');
}); 

/*
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hola Mundo\n');
});

server.listen(port, hostname, () => {
    console.log(`Servidor está corriendo sobre http://${hostname}:${port}`)
})
*/
