/**
 * resets board to original layout
 * NOTE only to be used on reset press
 * @date 22/02/2024 - 21:38:58
 *
 * @export
 * @param {Array of Objects} spriteList
 */
export function resetBoard(spriteList) {
  // console.log(spriteList);
  spriteList.forEach((sprite) => {
    if (sprite.startingLocation) {
      // console.log(sprite.name);
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
