import { resetBoard } from "./helper/setUpBoard.js";

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

export default class ExampleScene extends Phaser.Scene {
  constructor() {
    super();
    this.currentTilePositionX;
    this.currentTilePositionY;
    this.setPlayer = 1;
    this.numberOfPlayer = 4;
    this.gridArray = [];
    this.size = 17;
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

    const button = this.add
      .sprite((3 * 1184) / 4, 750, `reset`)
      .setInteractive();
    button.on("pointerdown", () => {
      socket.emit("resetBoardServer");
    });

    socket.on("resetBoardClient", () => {
      if (this.winnerText) {
        this.winnerText.setText("");
      }
      this.restartTimer(this.gridArray);
      resetBoard(this.children.list);
      this.setPlayer = 1;
    });

    this.setGrid();

    this.restartTimer();

    function successCallbackFunction(gameState) {
      this.setTiles(gameState);
    }

    fetchGameSetup(successCallbackFunction.bind(this));

    this.winnerText;

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
        this.canATileGoInThisLocation(gameObject) &&
        gameObject.texture.key === `player${this.setPlayer}`
      ) {
        gameObject.setTint(); //change the colour back
        //this.restartTimer();
        this.gridArray.map((gridPosition) => {
          //check if the position is accepted
          if (
            gridPosition.x === gameObject.x &&
            gridPosition.y === gameObject.y
          ) {
            //this.checkFiveInARow(gridPosition, gameObject, gridArray);
            gridPosition.player = gameObject.texture.key; //update the gridArray with the player occupying the position (x,y)
            gameObject.disableInteractive();
            gridPosition.played = true;
            //check for winner and display text
            if (this.checkFiveInARow(gridPosition, gameObject) === true) {
              this.winnerText = this.add
                .text(100, 20, `Player${this.setPlayer} WINS!!!!`, {
                  color: "#1e1e1e",
                })
                .setFontSize(100);
            }
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

      this.moveSpriteByName(data.name, data.x, data.y);

      const gridPosition =
        this.gridArray[this.getGridArrayIndexFromLocation(data.x, data.y)];
      gridPosition.player = data.textureKey;
      gridPosition.played = true;

      this.restartTimer();
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

  canATileGoInThisLocation(gameObject) {
    const currentgridArrayIndex = this.getGridArrayIndexFromLocation(
      gameObject.x,
      gameObject.y
    );

    if (currentgridArrayIndex === false) {
      return false;
    }

    if (this.gridArray[currentgridArrayIndex].player !== null) {
      return false;
    } else if (
      currentgridArrayIndex % this.size !== 0 &&
      this.gridArray[currentgridArrayIndex - 1].player !== null
    ) {
      //TOP
      return true;
    } else if (
      (currentgridArrayIndex + 1) % this.size !== 0 &&
      this.gridArray[currentgridArrayIndex + 1].player !== null
    ) {
      //BOTTOM
      return true;
    } else if (
      this.size <= currentgridArrayIndex &&
      this.gridArray[currentgridArrayIndex - this.size].player !== null
    ) {
      //LEFT
      return true;
    } else if (
      currentgridArrayIndex + this.size < this.gridArray.length &&
      this.gridArray[currentgridArrayIndex + this.size].player !== null
    ) {
      //RIGHT
      return true;
    } else if (
      currentgridArrayIndex === 144 &&
      this.gridArray[currentgridArrayIndex].player === null
    ) {
      return true;
    }

    return false;
  }

  getGridArrayIndexFromLocation(locationX, locationY) {
    let indexValue = false;
    this.gridArray.map((gridPosition, index) => {
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

  checkFiveInARow(gridPosition, gameObject) {
    let currGridArrIndex = Number(gridPosition.name.slice(4));
    let verticalCount = 0;
    let horizontalCount = 0;
    let positiveDiagonalCount = 0;
    let negativeDiagonalCount = 0;
    let currCheck = currGridArrIndex;
    for (let i = 0; i < 32; i++) {
      // if checked 4 to a given side, go back to middle
      if (
        i === 4 ||
        i === 8 ||
        i === 12 ||
        i === 16 ||
        i === 20 ||
        i === 24 ||
        i === 28
      ) {
        currCheck = currGridArrIndex;
      }
      // check above
      if (i < 4) {
        if (
          currCheck - 1 >= 0 &&
          this.gridArray[(currCheck -= 1)].player === gameObject.texture.key
        ) {
          verticalCount++;
        }
      }
      // check below
      if (i >= 4 && i < 8) {
        if (
          currCheck + 1 <= 288 &&
          this.gridArray[(currCheck += 1)].player === gameObject.texture.key
        ) {
          verticalCount++;
        }
      }
      // check to the right
      if (i >= 8 && i < 12) {
        if (
          currCheck + 17 <= 288 &&
          this.gridArray[(currCheck += 17)].player === gameObject.texture.key
        ) {
          horizontalCount++;
        }
      }
      // check to the left
      if (i >= 12 && i < 16) {
        if (
          currCheck - 17 >= 0 &&
          this.gridArray[(currCheck -= 17)].player === gameObject.texture.key
        ) {
          horizontalCount++;
        }
      }
      // check top right
      if (i >= 16 && i < 20) {
        if (
          currCheck + 17 - 1 >= 0 &&
          currCheck + 17 - 1 <= 288 &&
          this.gridArray[(currCheck += 17 - 1)].player ===
            gameObject.texture.key
        ) {
          positiveDiagonalCount++;
        }
      }
      // check bottom left
      if (i >= 20 && i < 24) {
        if (
          currCheck - 17 + 1 >= 0 &&
          currCheck - 17 + 1 <= 288 &&
          this.gridArray[(currCheck = currCheck - 16)].player ===
            gameObject.texture.key
        ) {
          positiveDiagonalCount++;
        }
      }
      // check top left
      if (i >= 24 && i < 28) {
        if (
          currCheck - 18 >= 0 &&
          currCheck - 18 <= 288 &&
          this.gridArray[(currCheck -= 18)].player === gameObject.texture.key
        ) {
          negativeDiagonalCount++;
        }
      }
      // check bottom right
      if (i >= 28) {
        if (
          currCheck + 18 <= 288 &&
          this.gridArray[(currCheck += 18)].player === gameObject.texture.key
        ) {
          negativeDiagonalCount++;
        }
      }
    }

    // console.log the winner
    if (
      verticalCount >= 4 ||
      horizontalCount >= 4 ||
      positiveDiagonalCount === 4 ||
      negativeDiagonalCount === 4
    ) {
      return true;
    } else {
      return false;
    }
  }

  setGrid() {
    const totalTiles = this.size * this.size;
    for (let i = 0; i < totalTiles; i++) {
      const x = ((37 - this.size) / 2) * 32 + Math.floor(i / this.size) * 32; //37 is the width of the screen (1184/32)
      const y = ((25 - this.size) / 2) * 32 + (i % this.size) * 32; //25 is the height of the screen (800/32)
      this.add
        .zone(1184 / 2, 800 / 2, this.size * 32, this.size * 32)
        .setRectangleDropZone(this.size * 32, this.size * 32);
      if (i === Math.floor(totalTiles / 2)) {
        const gridPosition = this.add
          .sprite(x, y, `centreblock`) //the centre position is in a darker gray
          .setOrigin(0, 0);
        gridPosition.name = `grid${i}`;
        gridPosition.startingLocation = [x, y];
        gridPosition.description = "board";
        gridPosition.player = null;
        gridPosition.played = false;

        this.gridArray.push(gridPosition);
      } else {
        const gridPosition = this.add.sprite(x, y, `gridblock`).setOrigin(0, 0);
        gridPosition.name = `grid${i}`;
        gridPosition.startingLocation = [x, y];
        gridPosition.description = "board";
        gridPosition.player = null;
        gridPosition.played = false;

        this.gridArray.push(gridPosition);
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
        block.startingLocation = [x, y];
        block.description = "playersTile";
        block.depth = 1;
      }
    });
    this.addTilesToBoard(gameState.tilesPlayed);
  }

  restartTimer = () => {
    this.totalTime = 5;
    if (this.timerText) {
      this.timerText.updateText("Timer: " + this.formatTime(this.totalTime));
    } else {
      this.timerText = this.add.text(
        1184 / 4,
        750,
        "Timer: " + this.formatTime(this.totalTime),
        {
          font: "35px Arial",
          fill: "#1e1e1e",
        }
      );
      this.timerText.setOrigin(0.5);
    }
    if (this.timerEvent) {
      this.timerEvent.remove();
    }
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.onTimerTick,
      callbackScope: this,
      loop: true,
    });
  };

  formatTime = (seconds) => {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    if (remainingSeconds < 10) {
      remainingSeconds = "0" + remainingSeconds;
    }

    return minutes + ":" + remainingSeconds;
  };

  onTimerTick = () => {
    this.totalTime--;
    this.timerText.setText("Timer: " + this.formatTime(this.totalTime));

    if (this.totalTime <= 0) {
      this.timerEvent.remove();

      const whereToPlaceTile = this.pickRandomLocationItCanGo();
      console.log(whereToPlaceTile);

      if (whereToPlaceTile) {
        //search for a tile that is in its original position and move it
        for (let i = 0; i < 16; i++) {
          const findSpriteUnmoved = this.children.list.find((child) => {
            return child.name === `player${this.setPlayer}tile${i}`;
          });
          const findGridPosition = this.children.list.find((child) => {
            return (
              child.description === "board" &&
              child.x === whereToPlaceTile.x &&
              child.y === whereToPlaceTile.y
            );
          });

          if (
            findSpriteUnmoved.x === findSpriteUnmoved.startingLocation[0] &&
            findSpriteUnmoved.y === findSpriteUnmoved.startingLocation[1]
          ) {
            findSpriteUnmoved.x = whereToPlaceTile.x;
            findSpriteUnmoved.y = whereToPlaceTile.y;
            i = 16;

            findGridPosition.player = `player${this.setPlayer}`;
            findSpriteUnmoved.disableInteractive();
            findGridPosition.played = true;

            //check for winner and display text
            if (
              this.checkFiveInARow(findGridPosition, findSpriteUnmoved) === true
            ) {
              this.winnerText = this.add
                .text(100, 20, `Player${this.setPlayer} WINS!!!!`, {
                  color: "#1e1e1e",
                })
                .setFontSize(100);
            }
            socket.emit("draggedObjectPosition", findSpriteUnmoved);
          }
        }
      }
      this.restartTimer();
    }
  };

  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  pickRandomLocationItCanGo() {
    const playableLocation = this.listOfAllPlayableLocations();
    console.log(playableLocation);
    const randomPosition = this.getRndInteger(0, playableLocation.length);
    return playableLocation[randomPosition];
  }

  listOfAllPlayableLocations() {
    const playableLocations = [];
    this.gridArray.map((item, index) => {
      if (
        this.canATileGoInThisLocation({
          x: this.gridArray[index].x,
          y: this.gridArray[index].y,
        })
      ) {
        playableLocations.push({
          x: this.gridArray[index].x,
          y: this.gridArray[index].y,
        });
      }
    });
    return playableLocations;
  }
}
