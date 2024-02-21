const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());

//app.use(express.static(path.join(__dirname, '../..', 'clientServe3/client')));

//app.get('/game', (req, res) => {
//res.sendFile(path.join(__dirname, '../..', 'clientServe3/client/index.html'));
//});

app.use((err, req, res, next) => {
  console.log(err, 'error in error handling block app.js');

  next(err);
});

io.on('connection', (socket) => {
  console.log(`A user connected${socket.id}`);

  socket.on('send_message', (data) => {
    console.log(data, '<<<');
    socket.broadcast.emit('receive_message', data);
  });
  socket.on('draggedObjectPosition', (data) => {
    console.log(socket.id, data, '<<<<drag data');
    io.emit('drag-end', data);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

module.exports = { app, server };
