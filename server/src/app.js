const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io"); // CORS block interactions between client frontend and server back end, "*" mean alow all and will be considered as security fail, later need to specify and remove "*"
const app = express();
const {
  addGameStateIfItDoesNotExist,
  tileMovedInGame,
  resetBoard,
  getGameState,
} = require("./models/gameState.models.js");

//const { Server } = require('socket.io');
/*const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});*/

const cors = require("cors");
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const { getHello } = require("./controllers/controllers.js");
const { loadConfigFromFile } = require("vite");



app.use(express.json());

app.use(express.static(path.join(__dirname, "../..", "phaser3-tutorial-src")));

app.get("/api/hello", getHello);

app.get("/game", (req, res) => {
  const room_id = req.query.room_id;
  let playersCount = req.query.players;

  addGameStateIfItDoesNotExist(room_id, playersCount);

  res.sendFile(
    path.join(__dirname, "../..", "phaser3-tutorial-src/prototype.html")
  );
});

app.use((err, req, res, next) => {
  console.log(err, "error in error handling block app.js");

  next(err);
});

io.on("connection", (socket) => {
  // TODO currently there is no data validation on the socket. There client could send bad request and the be sent directly to other users
  console.log("A user connected");

  socket.on("joinRoom", (room_id) => {
    socket.join(room_id);

    addGameStateIfItDoesNotExist(room_id);

    console.log(`User joined room: ${room_id}`);
  });

  socket.on("send_message", (data) => {
    console.log(data, "<<<chat data");
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("draggedObjectPosition", (data) => {
    room_id = Array.from(socket.rooms)[1];

    // allGameStates[room_id].tilesPlayed.push(data);
    tileMovedInGame(room_id, data);

    io.to(room_id).emit("drag-end", data);
  });
  socket.on("getGameState", (room_id) => {
    socket.emit("sendGameState", getGameState(room_id));
  });

  socket.on("resetBoardServer", (room_id) => {
    room_id = Array.from(socket.rooms)[1];

    // allGameStates[room_id].tilesPlayed = [];
    resetBoard(room_id);
    io.to(room_id).emit("resetBoardClient");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

module.exports = { app, server };
