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

io.on('connection', function(socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected');

  socket.on('disconnect', function() {
    console.log('A user has disconnected.', io.engine.clientsCount);
    io.sockets.emit('userConnection', io.engine.clientsCount);
  });
});

module.exports = server;
