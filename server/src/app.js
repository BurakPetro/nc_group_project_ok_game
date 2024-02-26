const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io"); // CORS block interactions between client frontend and server back end, "*" mean alow all and will be considered as security fail, later need to specify and remove "*"
const app = express();
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV is not set.");
}

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

let roomData = {};
if (process.env.NODE_ENV === "development") {
  console.log("Running in development mode");
  roomData = require("./test/roomTestDate.js").roomTestDate;
}
// TODO add function to allGameStates to remove games no one is currently using
/**
 * allGameStates to hold the data for all games currently being played
 * @date 20/02/2024 - 20:52:21
 *
 * @type {{}}
 */
const allGameStates = roomData;

app.use(express.json());

app.use(express.static(path.join(__dirname, "../..", "phaser3-tutorial-src")));

app.get("/api/hello", getHello);

app.get("/game", (req, res) => {
  const room_id = req.query.room_id;
  let playersCount = req.query.players;

  if (["2", "3", "4"].includes(playersCount)) {
    playersCount = Number(playersCount);
  } else {
    playersCount = 4;
  }
  console.log(room_id, playersCount, "<-- player count");

  if (!roomData.hasOwnProperty(room_id)) {
    roomData[room_id] = { players: playersCount, tilesPlayed: [] };
  }
  console.log(roomData[room_id]);

  res.sendFile(
    path.join(__dirname, "../..", "phaser3-tutorial-src/prototype.html")
  );
});

app.use((err, req, res, next) => {
  console.log(err, "error in error handling block app.js");

  next(err);
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (room_id) => {
    socket.join(room_id);

    if (!allGameStates.hasOwnProperty(room_id)) {
      console.log(`Create Room: ${room_id}`);
      // TODO we made need to change the default room set up if room does not exist.
      allGameStates[room_id] = { players: 4, tilesPlayed: [] };
    }

    console.log(`User joined room: ${room_id}`);
  });

  socket.on("send_message", (data) => {
    console.log(data, "<<<chat data");
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("draggedObjectPosition", (data) => {
    room_id = Array.from(socket.rooms)[1];

    allGameStates[room_id].tilesPlayed.push(data);

    io.to(room_id).emit("drag-end", data);
  });
  socket.on("getGameState", (room_id) => {
    socket.emit("sendGameState", allGameStates[room_id]);
  });

  socket.on("resetBoardServer", (room_id) => {
    room_id = Array.from(socket.rooms)[1];

    allGameStates[room_id].tilesPlayed = [];
    io.to(room_id).emit("resetBoardClient");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

module.exports = { app, server };
