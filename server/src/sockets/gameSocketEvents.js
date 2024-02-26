const {
  addGameStateIfItDoesNotExist,
  tileMovedInGame,
  resetBoard,
  getGameState,
} = require("../models/gameState.models");

module.exports = (socket, io) => {
  socket.on("joinRoom", (room_id) => {
    socket.join(room_id);
    addGameStateIfItDoesNotExist(room_id);
    console.log(`User joined room: ${room_id}`);
  });

  socket.on("draggedObjectPosition", (data) => {
    room_id = Array.from(socket.rooms)[1];
    tileMovedInGame(room_id, data);
    io.to(room_id).emit("drag-end", data);
  });

  socket.on("getGameState", (room_id) => {
    socket.emit("sendGameState", getGameState(room_id));
  });

  socket.on("resetBoardServer", (room_id) => {
    room_id = Array.from(socket.rooms)[1];
    resetBoard(room_id);
    io.to(room_id).emit("resetBoardClient");
  });
};
