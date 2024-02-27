/**
 * moveSpriteByName - Move sprite to given location, and update the gridArray
 * Note does not check if location is correct
 * @date 20/02/2024 - 20:50:05
 *
 * @param {Object} spriteName
 * @param {Number} newX
 * @param {Number} newY
 */
export function moveSpriteByName(scene, spriteName, newX, newY) {
  const spriteToMove = scene.children.list.find((child) => {
    return child.name === spriteName;
  });

  if (spriteToMove) {
    spriteToMove.setPosition(newX, newY);
    spriteToMove.disableInteractive();

    if (scene.getGridArrayIndexFromLocation(newX, newY)) {
      const gridPosition =
        scene.gridArray[scene.getGridArrayIndexFromLocation(newX, newY)];
      gridPosition.player = spriteToMove.texture.key;
      gridPosition.played = true;
    }
  } else {
    console.log(`Sprite with name ${spriteName} not found`);
  }
}

export function canOnlyMoveOwnTiles(scene) {
  // if playLocally = false make it so they can only move there own tiles
  // TODO see if it still works after reset
  if (scene.playLocally === false) {
    scene.playerBlocks.forEach((tile) => {
      if (tile.playerAssignment !== scene.whichPlayerAmI) {
        tile.setInteractive({ draggable: false });
      }
    });
  }
}
