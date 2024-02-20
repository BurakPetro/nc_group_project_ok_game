const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const { getHello } = require("./controllers/controllers.js");

let roomTestDate = {};
if (process.env.NODE_ENV === "development") {
  console.log("Running in development mode");
  roomTestDate = require("./test/roomTestDate.js").roomTestDate;
}
// NOTE allGameStates to hold the data for all games currently being played
const allGameStates = roomTestDate;

app.use(express.json());

app.use(express.static(path.join(__dirname, "../..", "phaser3-tutorial-src")));

app.get("/api/hello", getHello);

app.get("/game", (req, res) => {
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
    console.log(`User joined room: ${room_id}`);
    // console.log(socket);
  });

  socket.on("draggedObjectPosition", (data) => {
    // console.log(data);
    room_id = Array.from(socket.rooms)[1];
    console.log(room_id);
    console.log(socket.rooms);
    io.emit("drag-end", data);
  });
  socket.on("getGameState", (room_id) => {
    socket.emit("sendGameState", allGameStates[room_id]);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

module.exports = { app, server };
