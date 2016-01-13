const http = require('http');
const express = require('express');

const app = express();

var port = process.env.PORT || 3000;

var server = http.createServer(app)
                 .listen(port, function() {
                   console.log('Listening to port ' + port + '.');
                 });

const socketIO = require('socket.io');
const io = socketIO(server);

app.use(express.static('public'));

app.get('/', function(request, response){
  response.sendFile(__dirname + '/public/index.html');
});





module.exports = server;
