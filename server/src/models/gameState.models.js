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
  const assignedPlayers = {};

  for (let index = 1; index <= playersCount; index++) {
    assignedPlayers[`player${index}`] = null;
  }

  if (!allGameStates.hasOwnProperty(room_id)) {
    allGameStates[room_id] = {
      players: playersCount,
      tilesPlayed: [],
      assignedPlayers,
    };
    console.log(allGameStates[room_id]);
    return `add game room_id: ${room_id}`;
  }
  return `game already on room_id: ${room_id}`;
}

function tileMovedInGame(room_id, tileMovedObject) {
  if (room_id) {
    allGameStates[room_id].tilesPlayed.push(tileMovedObject);
  } else {
    console.log(`room_id: ${room_id} failed to add tile to game.`);
  }
}

function resetBoard(room_id) {
  allGameStates[room_id].tilesPlayed = [];
}

function getGameState(room_id) {
  return allGameStates[room_id];
}

function addPlayerToGame(room_id, user_id) {
  let foundPlayer = false;

  Object.keys(allGameStates[room_id].assignedPlayers).forEach((key) => {
    if (allGameStates[room_id].assignedPlayers[key] === null && !foundPlayer) {
      allGameStates[room_id].assignedPlayers[key] = user_id;
      foundPlayer = true;
    }
  });
  console.log(allGameStates[room_id].assignedPlayers, "assignedPlayers");
  return foundPlayer;
}

function removePlayerFromGame(user_id) {
  let room_id = null;
  for (const roomKey in allGameStates) {
    const room = allGameStates[roomKey];
    if (room.assignedPlayers) {
      for (const playerKey in room.assignedPlayers) {
        if (room.assignedPlayers[playerKey] === user_id) {
          room_id = roomKey;
          console.log(`removed ${user_id} player from room_id ${roomKey}`);
          room.assignedPlayers[playerKey] = null;
        }
      }
    }
  }
  if (room_id) {
    console.log(room_id, "<--- this is room id");
    return room_id;
  }
}

function fetchPlayerAssignment(room_id) {
  return allGameStates[room_id].assignedPlayers;
}

module.exports = {
  addGameStateIfItDoesNotExist,
  tileMovedInGame,
  resetBoard,
  getGameState,
  addPlayerToGame,
  removePlayerFromGame,
  fetchPlayerAssignment
};
