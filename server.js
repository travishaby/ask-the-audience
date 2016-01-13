const http = require('http');
const express = require('express');
const _ = require('lodash');

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

var votes = {};

io.on('connection', function(socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit('statusMessage', 'You are connected');

  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      socket.emit('voteCast', "Your vote of " + message + " has been cast!")
      socket.emit('voteCount', _.countBy(votes))
    }
  });

  socket.on('disconnect', function() {
    console.log('A user has disconnected.', io.engine.clientsCount);
    delete votes[socket.id];
    socket.emit('voteCount', _.countBy(votes))
    io.sockets.emit('userConnection', io.engine.clientsCount);
  });
});

module.exports = server;
