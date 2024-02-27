export function updatePlayerName(scene) {
  // TODO set up function to update the text
  // TODO update at game set up and tell the person which one they are
  // TODO socket to run this function
  // TODO further review into playLocally games as it may be best to assign the player to have you under all
  // TODO bots to have bot under name
  scene.playersNames.forEach((playerText) => {
    // adds 'you' under person name
    if (scene.assignedPlayers[playerText.playerNumber] === scene.socket.id) {
      playerText.text += "\n (you)";
    }
  });
}

// TODO make a function that only allows that play to move there tiles if it not local host
