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
  // TODO set gridPosition player to player and player to true
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
