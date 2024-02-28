import { updatePlayerName } from "./playerUtils.js";
import { canOnlyMoveOwnTiles } from "./spriteUtils.js";

/**
 * resets board to original layout
 * NOTE only to be used on reset press
 * @date 22/02/2024 - 21:38:58
 *
 * @export
 * @param {Array of Objects} spriteList
 */
export function resetBoard(spriteList) {
  spriteList.forEach((sprite) => {
    if (sprite.startingLocation) {
      [sprite.x, sprite.y] = sprite.startingLocation;
    }
    if (sprite.description === "board") {
      sprite.played = false;
      sprite.player = null;
    }
    if (sprite.description === "playersTile") {
      sprite.setInteractive({ draggable: true });
    }
  });
}

export function setGameStateToGame(gameState, scene) {
  scene.assignedPlayers = gameState.assignedPlayers;

  for (const player in scene.assignedPlayers) {
    if (scene.assignedPlayers[player] === scene.socket.id) {
      scene.whichPlayerAmI = player;
    }
  }

  scene.timePerTurn = gameState.timer;
  scene.restartTimer();
  scene.playLocally = gameState.playLocally;

  scene.player2IsBot =
    scene.assignedPlayers["player2"] === "bot" ? true : false;
  scene.player3IsBot =
    scene.assignedPlayers["player3"] === "bot" ? true : false;
  scene.player4IsBot =
    scene.assignedPlayers["player4"] === "bot" ? true : false;
  scene.setTiles(gameState);
  // note setTiles before updatePlayerName as the text for name is added in here
  updatePlayerName(scene);
  canOnlyMoveOwnTiles(scene);
}
