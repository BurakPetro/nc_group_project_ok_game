const path = require("path");
const {
  addGameStateIfItDoesNotExist,
} = require("../models/gameState.models.js");

const getGame = (req, res) => {
  // TODO if room_id is not given return something to client

  const room_id = req.query.room_id;
  let playersCount = req.query.players;
  let bots = req.query.bots;
  let playlocally = req.query.playlocally; // can be true or false
  let timer = req.query.timer; // can be 10 or 30 or 60 or false(OFF)

  addGameStateIfItDoesNotExist(room_id, playersCount);

  res.sendFile(
    path.join(__dirname, "../../..", "phaser3-tutorial-src/prototype.html")
  );
};

module.exports = { getGame };
