const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const { configureSockets } = require("./sockets/socketManger.js");
const { getGame } = require("./controllers/gameState.controllers.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../..", "phaser3-tutorial-src")));

const server = http.createServer(app);
configureSockets(server);

app.get("/game", getGame);

app.use((err, req, res, next) => {
  console.log(err, "error in error handling block app.js");

  next(err);
});

module.exports = { app, server };
