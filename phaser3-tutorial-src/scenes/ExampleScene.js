const socket = io();
const params = new URLSearchParams(document.location.search);
const room_id = params.get("room_id");
socket.emit("joinRoom", room_id);

function fetchGameSetup(successCallback) {
  const params = new URLSearchParams(document.location.search);
  const room_id = params.get("room_id");
  socket.emit("getGameState", room_id);

  socket.on("sendGameState", (response) => {
    socket.off("sendGameState");
    successCallback(response);
  });
}

function formatTime(seconds) {
  // Minutes
  var minutes = Math.floor(seconds / 60);
  // Seconds
  var partInSeconds = seconds % 60;
  // Adds left zeros to seconds
  partInSeconds = partInSeconds.toString().padStart(2, "0");
  // Returns formated time
  return `${minutes}:${partInSeconds}`;
}

export default class ExampleScene extends Phaser.Scene {
  constructor() {
    super();
    this.currentTilePositionX;
    this.currentTilePositionY;

    this.setPlayer = 1;

    // NOTE - numberOfPlayer may get updated from gameState, default value 4
    this.numberOfPlayer = 4;
  }
  preload() {
    this.load.image("bg", "assets/background.png");
    const blockImg = ["redtile2", "greentile", "bluetile", "orangetile"];
    blockImg.forEach((color, index) => {
      this.load.spritesheet(`player${index + 1}`, `assets/${color}.png`, {
        frameWidth: 30,
        frameHeight: 30,
      });
    });
    this.load.spritesheet("gridblock", "assets/graytile.png", {
      frameWidth: 30,
      frameHeight: 30,
    });
    this.load.spritesheet("centreblock", "assets/centraltile.png", {
      frameWidth: 30,
      frameHeight: 30,
    });
    this.load.spritesheet("reset", "assets/reset.png", {
      frameWidth: 100,
      frameHeight: 40,
    });
  }

  create() {
    this.add.image(600, 412, "bg");
    /*
    this.initialTime = 60;
    this.add.text(300, 32, "Countdown: " + formatTime(this.initialTime));
    // Each 1000 ms call onEvent
    this.time.addEvent({
      delay: 1000,
      //callback: onEvent,
      callbackScope: this,
      loop: true,
    });*/

    const button = this.add.sprite(1184 / 2, 750, `reset`).setInteractive();
    button.on("pointerdown", () => {
      gridArray = [];
      this.setPlayer = 1;
      this.setGrid(size, gridArray);
      this.setTiles({ players: this.numberOfPlayer, tilesPlayed: [] });
    });

    const size = 17;
    let gridArray = [];

    this.setGrid(size, gridArray);

    function successCallbackFunction(gameState) {
      this.setTiles(gameState);
    }

    fetchGameSetup(successCallbackFunction.bind(this));

    this.input.on("dragstart", (pointer, gameObject) => {
      gameObject.setTint(0x868e96);
      this.currentTilePositionX = gameObject.x;
      this.currentTilePositionY = gameObject.y;
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      dragX = Phaser.Math.Snap.To(dragX, 32);
      dragY = Phaser.Math.Snap.To(dragY, 32);
      gameObject.setPosition(dragX, dragY);
    });

    this.input.on("dragend", (pointer, gameObject, dropped) => {
      //check if player is using its own tiles and can go in that location

      if (
        this.canATileGoInThisLocation(gridArray, gameObject, size) &&
        gameObject.texture.key === `player${this.setPlayer}`
      ) {
        gameObject.setTint(); //change the colour back

        gridArray.map((gridPosition) => {
          //check if the position is accepted
          if (
            gridPosition.x === gameObject.x &&
            gridPosition.y === gameObject.y
          ) {
            gridPosition.player = gameObject.texture.key; //update the gridArray with the player occupying the position (x,y)
            gameObject.disableInteractive();
            gridPosition.played = true;
          }
        });

        socket.emit("draggedObjectPosition", gameObject);
      } else {
        gameObject.setTint();
        //if the object is dropped outside the grid it goes back to its original position in the deck
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });

    socket.on("drag-end", (data) => {
      this.updateWhoTurnItIsFromPlayedTile(data.name);

      // TODO looking into making gridArray a this. variable as passing it around a lot

      this.moveSpriteByName(data.name, data.x, data.y, gridArray);

      const gridPosition =
        gridArray[
          this.getGridArrayIndexFromLocation(gridArray, data.x, data.y)
        ];

      gridPosition.player = data.textureKey;
      gridPosition.played = true;
    });
  }
  /**
   * moveSpriteByName - Move sprite to given location, Note does not check if location is correct
   * @date 20/02/2024 - 20:50:05
   *
   * @param {Object} spriteName
   * @param {Number} newX
   * @param {Number} newY
   */
  moveSpriteByName(spriteName, newX, newY) {
    const spriteToMove = this.children.list.find((child) => {
      return child.name === spriteName;
    });
    // TODO set gridPosition player to player and player to true
    if (spriteToMove) {
      spriteToMove.setPosition(newX, newY);
      spriteToMove.disableInteractive();
    } else {
      console.log(`Sprite with name ${spriteName} not found`);
    }
  }

  /**
   * addTilesToBoard move the tiles in the array and sets correct player turn
   * @date 20/02/2024 - 20:46:55
   *
   * @param {Array} tilesToAdd
   */
  addTilesToBoard(tilesToAdd) {
    tilesToAdd.forEach((value, index) => {
      this.moveSpriteByName(value.name, value.x, value.y);
      if (tilesToAdd.length === index + 1) {
        this.updateWhoTurnItIsFromPlayedTile(value.name);
      }
    });
  }

  canATileGoInThisLocation(gridArray, gameObject, gridSize) {
    const currentgridArrayIndex = this.getGridArrayIndexFromLocation(
      gridArray,
      gameObject.x,
      gameObject.y
    );

    if (currentgridArrayIndex === false) {
      return false;
    }

    if (gridArray[currentgridArrayIndex].player !== null) {
      return false;
    } else if (
      currentgridArrayIndex % 17 !== 0 &&
      gridArray[currentgridArrayIndex - 1].player !== null
    ) {
      //TOP
      return true;
    } else if (
      (currentgridArrayIndex + 1) % 17 !== 0 &&
      gridArray[currentgridArrayIndex + 1].player !== null
    ) {
      //BOTTOM
      return true;
    } else if (
      gridSize <= currentgridArrayIndex &&
      gridArray[currentgridArrayIndex - gridSize].player !== null
    ) {
      //LEFT
      return true;
    } else if (
      currentgridArrayIndex + gridSize < gridArray.length &&
      gridArray[currentgridArrayIndex + gridSize].player !== null
    ) {
      //RIGHT
      return true;
    } else if (
      currentgridArrayIndex === 144 &&
      gridArray[currentgridArrayIndex].player === null
    ) {
      return true;
    }

    return false;
  }

  getGridArrayIndexFromLocation(gridArray, locationX, locationY) {
    let indexValue = false;
    gridArray.map((gridPosition, index) => {
      if (gridPosition.x === locationX && gridPosition.y === locationY) {
        indexValue = index;
      }
    });

    return indexValue;
  }
  /**
   * updateWhoTurnItIsFromPlayedTile - update players who's turn it is by providing it with the name of the last tile played
   * @date 21/02/2024 - 10:22:41
   *
   * @param {String} lastTilePlayedName
   */
  updateWhoTurnItIsFromPlayedTile(lastTilePlayedName) {
    if (Number(lastTilePlayedName[6]) === this.numberOfPlayer) {
      this.setPlayer = 1;
    } else {
      this.setPlayer = Number(lastTilePlayedName[6]) + 1;
    }
  }

  setGrid(size, gridArray) {
    const totalTiles = size * size;
    for (let i = 0; i < totalTiles; i++) {
      const x = ((37 - size) / 2) * 32 + Math.floor(i / size) * 32; //37 is the width of the screen (1184/32)
      const y = ((25 - size) / 2) * 32 + (i % size) * 32; //25 is the height of the screen (800/32)
      this.add
        .zone(1184 / 2, 800 / 2, size * 32, size * 32)
        .setRectangleDropZone(size * 32, size * 32);
      if (i === Math.floor(totalTiles / 2)) {
        const gridPosition = this.add
          .sprite(x, y, `centreblock`) //the centre position is in a darker gray
          .setOrigin(0, 0);
        gridPosition.name = `grid${i}`;
        gridArray.push({
          name: gridPosition.name,
          x: x,
          y: y,
          player: null,
          played: false,
        });
      } else {
        const gridPosition = this.add.sprite(x, y, `gridblock`).setOrigin(0, 0);
        gridPosition.name = `grid${i}`;
        gridArray.push({
          name: gridPosition.name,
          x: x,
          y: y,
          player: null,
          played: false,
        });
      }
    }
  }

  setTiles(gameState) {
    this.numberOfPlayer = gameState.players;
    const playerData = [
      { x: 32, y: 32, color: "#1e1e1e" },
      { x: 1088, y: 32, color: "#1e1e1e" },
      { x: 1088, y: 480, color: "#1e1e1e" },
      { x: 32, y: 480, color: "#1e1e1e" },
    ].slice(0, gameState.players);
    playerData.forEach((player, playerIndex) => {
      this.add
        .text(player.x, player.y, `Player ${playerIndex + 1}`, {
          color: player.color,
        })
        .setFontSize(15);

      for (let i = 0; i < 16; i++) {
        const x = player.x + Math.floor(i / 8) * 32;
        const y = 32 + player.y + (i % 8) * 32;

        const block = this.add
          .sprite(x, y, `player${playerIndex + 1}`)
          .setOrigin(0, 0);
        block.setInteractive({ draggable: true });
        block.name = `player${playerIndex + 1}tile${i}`;
      }
    });
    this.addTilesToBoard(gameState.tilesPlayed);
  }
}
