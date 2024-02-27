const path = require("path");
const {
  addGameStateIfItDoesNotExist,
} = require("../models/gameState.models.js");

const getGame = (req, res) => {
  // TODO if room_id is not given return something to client
  // TODO add bots , playLocally , and , timer to roomData

  const room_id = req.query.room_id;
  const playersCount = req.query.players;
  const bots = req.query.bots;
  const playLocally = req.query.playlocally; // can be true or false
  const timer = req.query.timer; // can be 10 or 30 or 60 or false(OFF)

  addGameStateIfItDoesNotExist(room_id, playersCount, bots, playLocally, timer);

  res.sendFile(
    path.join(__dirname, "../../..", "phaser3-tutorial-src/prototype.html")
  );
};

module.exports = { getGame };
