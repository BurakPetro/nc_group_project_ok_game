let roomData = {};
if (process.env.NODE_ENV === "development") {
  console.log("Running in development mode");
  roomData = require("../test/roomTestDate.js").roomTestDate;
}
// TODO add function to allGameStates to remove games no one is currently using
/**
 * allGameStates to hold the data for all games currently being played
 * @date 20/02/2024 - 20:52:21
 *
 * @type {{}}
 */
const allGameStates = roomData;

function addGameStateIfItDoesNotExist(room_id, playersCount) {
  if (["2", "3", "4"].includes(playersCount)) {
    playersCount = Number(playersCount);
  } else {
    playersCount = 4;
  }

  if (!allGameStates.hasOwnProperty(room_id)) {
    allGameStates[room_id] = { players: playersCount, tilesPlayed: [] };
    return `add game room_id: ${room_id}`;
  }
  return `game already on room_id: ${room_id}`;
}

function tileMovedInGame(room_id, tileMovedObject) {
  allGameStates[room_id].tilesPlayed.push(tileMovedObject);
}

function resetBoard(room_id) {
  allGameStates[room_id].tilesPlayed = [];
}

function getGameState(room_id) {
  return allGameStates[room_id];
}

module.exports = {
  addGameStateIfItDoesNotExist,
  tileMovedInGame,
  resetBoard,
  getGameState,
};
