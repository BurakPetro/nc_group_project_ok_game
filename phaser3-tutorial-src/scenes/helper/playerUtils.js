export function updatePlayerName(scene) {
  scene.playersNames.forEach((playerText) => {
    // adds 'you' under person name
    playerText.text = scene.playersGeneratedNames[playerText.playerNumber];

    if (
      scene.assignedPlayers[playerText.playerNumber] === scene.socket.id &&
      !scene.playLocally
    ) {
      playerText.text += "\n(you)";
    } else if (scene.assignedPlayers[playerText.playerNumber] === "bot") {
      playerText.text += "\n🤖";
    } else if (
      scene.assignedPlayers[playerText.playerNumber] !== null &&
      !scene.playLocally
    ) {
      playerText.text += "\n✅";
    }
  });
}

// TODO make a function that only allows that play to move there tiles if it not local host
