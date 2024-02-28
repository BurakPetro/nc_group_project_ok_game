import { updatePlayerName } from "./playerUtils.js";
import { resetBoard } from "./setUpBoard.js";
import { moveSpriteByName } from "./spriteUtils.js";

const socketHandler = (socket, scene) => {
  socket.on("resetBoardClient", () => {
    if (scene.winnerText) {
      scene.winnerText.setText("");
    }
    scene.gameIsFinished = false;
    scene.restartTimer();
    resetBoard(scene.children.list);
    scene.setPlayer = 1;
  });

  socket.on("drag-end", (data) => {
    scene.updateWhoTurnItIsFromPlayedTile(data.name);
    moveSpriteByName(scene, data.name, data.x, data.y);
    const gridPosition =
      scene.gridArray[scene.getGridArrayIndexFromLocation(data.x, data.y)];
    gridPosition.player = data.textureKey;
    gridPosition.played = true;
    if (scene.checkWinner(gridPosition, data) === true) {
      scene.timerEvent.remove();
      scene.gameIsFinished = true;
      scene.printWinner();
    }
    scene.restartTimer();
  });

  socket.on("playersAssignmentUpdate", (assignedPlayers) => {
    // TODO that when players have been updated it updates the screen
    scene.assignedPlayers = assignedPlayers;
    updatePlayerName(scene);
  });
};

export default socketHandler;
