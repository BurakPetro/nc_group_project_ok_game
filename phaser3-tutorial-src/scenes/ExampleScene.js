import { setGameStateToGame } from "./helper/setUpBoard.js";
import { moveSpriteByName } from "./helper/spriteUtils.js";
import socketHandler from "./helper/socketHandler.js";

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
    this.turnSprite = null;
    this.setPlayer = 1;
    this.numberOfPlayer = 2;
    this.gridArray = [];
    this.size = 17;
    this.playerBlocks = []; // Array to store references to player blocks
    this.playerBlocksIndex = 0; // Access specific blocks
    this.player2IsBot = false;
    this.player3IsBot = false;
    this.player4IsBot = false;
    this.assignedPlayers = {};
    this.timePerTurn = 60;
    this.playLocally = true; // false will stop them from moving other tiles
    this.playersNames = []; // store text of players
    this.socket = socket;
    this.whichPlayerAmI = ""; // store value of which player user is e.g. player1
  }

  preload() {
    this.load.image("bg", "assets/background2.png");
    const blockImg = ["purple", "darkblue", "lightblue", "orange"];
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
    this.turnSprite = this.createTurnSprite();

    const button = this.add
      .sprite((3 * 1184) / 4, 750, `reset`)
      .setInteractive();
    button.on("pointerdown", () => {
      socket.emit("resetBoardServer");
    });

    socketHandler(socket, this);

    this.setGrid();

    this.restartTimer();

    function successCallbackFunction(gameState) {
      setGameStateToGame(gameState, this);
    }

    fetchGameSetup(successCallbackFunction.bind(this));

    this.winnerText;

    this.input.on("dragstart", (pointer, gameObject) => {
      if (gameObject.texture.key === `player${this.setPlayer}`) {
        gameObject.setTint(0x868e96);
        this.currentTilePositionX = gameObject.x;
        this.currentTilePositionY = gameObject.y;
      }
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      dragX = Phaser.Math.Snap.To(dragX, 32);
      dragY = Phaser.Math.Snap.To(dragY, 32);
      gameObject.setPosition(dragX, dragY);
    });

    this.keyboardUp = this.input.keyboard.on("keydown-UP", (event) => {
      this.playerBlocks[this.playerBlocksIndex].y -= 32;
      this.playerBlocks[this.playerBlocksIndex].y = Phaser.Math.Snap.To(
        this.playerBlocks[this.playerBlocksIndex].y,
        32
      );
    });

    this.keyboardDown = this.input.keyboard.on("keydown-DOWN", (event) => {
      this.playerBlocks[this.playerBlocksIndex].y += 32;
      this.playerBlocks[this.playerBlocksIndex].y = Phaser.Math.Snap.To(
        this.playerBlocks[this.playerBlocksIndex].y,
        32
      );
    });

    this.keyboardLeft = this.input.keyboard.on("keydown-LEFT", (event) => {
      this.playerBlocks[this.playerBlocksIndex].x -= 32;
      this.playerBlocks[this.playerBlocksIndex].x = Phaser.Math.Snap.To(
        this.playerBlocks[this.playerBlocksIndex].x,
        32
      );
    });

    this.keyboardRight = this.input.keyboard.on("keydown-RIGHT", (event) => {
      this.playerBlocks[this.playerBlocksIndex].setTint(0x868e96);
      this.playerBlocks[this.playerBlocksIndex].x += 32;
      this.playerBlocks[this.playerBlocksIndex].x = Phaser.Math.Snap.To(
        this.playerBlocks[this.playerBlocksIndex].x,
        32
      );
    });

    this.input.on("dragend", (pointer, gameObject, dropped) => {
      gameObject.setTint();
      if (
        this.canATileGoInThisLocation(gameObject) &&
        gameObject.texture.key === `player${this.setPlayer}`
      ) {
        this.gridArray.map((gridPosition) => {
          if (
            gridPosition.x === gameObject.x &&
            gridPosition.y === gameObject.y
          ) {
            gridPosition.player = gameObject.texture.key;
            this.setTilesNotInteractive();
            gridPosition.played = true;
            if (this.checkWinner(gridPosition, gameObject) === true) {
              this.printWinner();
            }
          }
        });
        socket.emit("draggedObjectPosition", gameObject);
      } else {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });

    this.input.keyboard.on("keydown-ENTER", () => {
      this.playerBlocks[this.playerBlocksIndex].setTint();
      if (
        this.canATileGoInThisLocation(
          this.playerBlocks[this.playerBlocksIndex]
        ) &&
        this.playerBlocks[this.playerBlocksIndex].texture.key ===
          `player${this.setPlayer}`
      ) {
        this.gridArray.map((gridPosition) => {
          if (
            gridPosition.x === this.playerBlocks[this.playerBlocksIndex].x &&
            gridPosition.y === this.playerBlocks[this.playerBlocksIndex].y
          ) {
            gridPosition.player =
              this.playerBlocks[this.playerBlocksIndex].texture.key;
            this.setTilesNotInteractive();
            gridPosition.played = true;
            if (
              this.checkWinner(
                gridPosition,
                this.playerBlocks[this.playerBlocksIndex]
              ) === true
            ) {
              this.printWinner();
            }
          }
        });
        socket.emit(
          "draggedObjectPosition",
          this.playerBlocks[this.playerBlocksIndex]
        );
      } else {
        this.playerBlocks[this.playerBlocksIndex].x =
          this.playerBlocks[this.playerBlocksIndex].startingLocation[0];
        this.playerBlocks[this.playerBlocksIndex].y =
          this.playerBlocks[this.playerBlocksIndex].startingLocation[1];
      }
    });
  }

  setTilesInteractive() {
    //this is to allow only the tiles of the current players to be moved
    if (
      this.setPlayer === 1 ||
      (this.setPlayer === 2 && this.player2IsBot === false) ||
      (this.setPlayer === 3 && this.player3IsBot === false) ||
      (this.setPlayer === 4 && this.player4IsBot === false)
    ) {
      this.keyboardDown.enabled = true;
      this.keyboardUp.enabled = true;
      this.keyboardRight.enabled = true;
      this.keyboardLeft.enabled = true;
      for (let i = 0; i < 16; i++) {
        const tileToBeSetInteractive = this.children.list.find((child) => {
          return child.name === `player${this.setPlayer}tile${i}`;
        });
        if (
          tileToBeSetInteractive.x ===
            tileToBeSetInteractive.startingLocation[0] &&
          tileToBeSetInteractive.y ===
            tileToBeSetInteractive.startingLocation[1]
        ) {
          tileToBeSetInteractive.setInteractive({ draggable: true });
        }
      }
    } else {
      //this is to prevent the bots tiles to be moved with the keyboard
      this.keyboardDown.enabled = false;
      this.keyboardUp.enabled = false;
      this.keyboardRight.enabled = false;
      this.keyboardLeft.enabled = false;
    }
  }

  setTilesNotInteractive() {
    for (let i = 0; i < 16; i++) {
      const tileToBeSetNotInteractive = this.children.list.find((child) => {
        return child.name === `player${this.setPlayer}tile${i}`;
      });
      if (
        tileToBeSetNotInteractive.x ===
          tileToBeSetNotInteractive.startingLocation[0] &&
        tileToBeSetNotInteractive.y ===
          tileToBeSetNotInteractive.startingLocation[1]
      ) {
        tileToBeSetNotInteractive.disableInteractive();
      }
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
      moveSpriteByName(this, value.name, value.x, value.y);
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
      currentgridArrayIndex === Math.floor((this.size * this.size) / 2) &&
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
    this.setTilesInteractive();
    if (this.setPlayer === 2) {
      this.turnSprite.setPosition(1055, -5);
      if (this.player2IsBot === true) {
        this.botMove();
      }
    } else if (this.setPlayer === 3) {
      this.turnSprite.setPosition(1055, 445);
      if (this.player3IsBot === true) {
        this.botMove();
      }
    } else if (this.setPlayer === 4) {
      this.turnSprite.setPosition(-4, 440);
      if (this.player4IsBot === true) {
        this.botMove();
      }
    } else {
      this.turnSprite.setPosition(-4, -5);
    }

    // loop through playerBlocks, find and update index for next available tile for the next player to use, this allows keyboard input to work
    this.playerBlocks.splice(this.playerBlocksIndex, 1); // remove tile, already played
    this.playerBlocksIndex = 0; // reset first before loop
    while (
      Number(this.playerBlocks[this.playerBlocksIndex].name.slice(6, 7)) !==
      this.setPlayer
    ) {
      this.playerBlocksIndex++;
    }
  }

  checkWinner(gridPosition, gameObject) {
    const arrayOfCounts = this.checkFiveInARow(gridPosition, gameObject);
    if (
      arrayOfCounts.verticalCount >= 4 ||
      arrayOfCounts.horizontalCount >= 4 ||
      arrayOfCounts.positiveDiagonalCount >= 4 ||
      arrayOfCounts.negativeDiagonalCount >= 4
    ) {
      return true;
    } else {
      return false;
    }
  }

  checkFiveInARow(gridPosition, gameObject) {
    let currGridArrIndex = Number(gridPosition.name.slice(4));
    let verticalCount = 0;
    let horizontalCount = 0;
    let positiveDiagonalCount = 0;
    let negativeDiagonalCount = 0;
    let currCheck = currGridArrIndex;

    // variable to know if gap in same line or hit edge of board
    const blockedInDirection = {
      above: false,
      below: false,
      right: false,
      left: false,
      topRight: false,
      bottomLeft: false,
      topLeft: false,
      bottomRight: false,
    };

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
          currCheck % this.size !== 0 &&
          this.gridArray[(currCheck -= 1)].player === gameObject.texture.key &&
          !blockedInDirection.above
        ) {
          verticalCount++;
        } else {
          blockedInDirection.above = true;
        }
      }
      // check below
      if (i >= 4 && i < 8) {
        if (
          (1 + currCheck) % this.size !== 0 &&
          this.gridArray[(currCheck += 1)].player === gameObject.texture.key &&
          !blockedInDirection.below
        ) {
          verticalCount++;
        } else {
          blockedInDirection.below = true;
        }
      }
      // check to the right
      if (i >= 8 && i < 12) {
        if (
          currCheck + this.size < this.size ** 2 &&
          this.gridArray[(currCheck += this.size)].player ===
            gameObject.texture.key &&
          !blockedInDirection.right
        ) {
          horizontalCount++;
        } else {
          blockedInDirection.right = true;
        }
      }
      // check to the left
      if (i >= 12 && i < 16) {
        if (
          currCheck - this.size >= 0 &&
          this.gridArray[(currCheck -= this.size)].player ===
            gameObject.texture.key &&
          !blockedInDirection.left
        ) {
          horizontalCount++;
        } else {
          blockedInDirection.left = true;
        }
      }
      // check top right
      if (i >= 16 && i < 20) {
        if (
          currCheck % this.size !== 0 &&
          currCheck + this.size < this.size ** 2 &&
          this.gridArray[(currCheck += this.size - 1)].player ===
            gameObject.texture.key &&
          !blockedInDirection.topRight
        ) {
          positiveDiagonalCount++;
        } else {
          blockedInDirection.topRight = true;
        }
      }
      // check bottom left
      if (i >= 20 && i < 24) {
        if (
          (1 + currCheck) % this.size !== 0 &&
          currCheck - this.size >= 0 &&
          this.gridArray[(currCheck -= this.size + 1)].player ===
            gameObject.texture.key &&
          !blockedInDirection.bottomLeft
        ) {
          positiveDiagonalCount++;
        } else {
          blockedInDirection.bottomLeft = true;
        }
      }
      // check top left
      if (i >= 24 && i < 28) {
        if (
          currCheck % this.size !== 0 &&
          currCheck - this.size >= 0 &&
          this.gridArray[(currCheck -= this.size + 1)].player ===
            gameObject.texture.key &&
          !blockedInDirection.topLeft
        ) {
          negativeDiagonalCount++;
        } else {
          blockedInDirection.topLeft = true;
        }
      }
      // check bottom right
      if (i >= 28) {
        if (
          (1 + currCheck) % this.size !== 0 &&
          currCheck + this.size < this.size ** 2 &&
          this.gridArray[(currCheck += this.size + 1)].player ===
            gameObject.texture.key &&
          !blockedInDirection.bottomRight
        ) {
          negativeDiagonalCount++;
        } else {
          blockedInDirection.bottomRight = true;
        }
      }
    }
    return {
      verticalCount: verticalCount,
      horizontalCount: horizontalCount,
      positiveDiagonalCount: positiveDiagonalCount,
      negativeDiagonalCount: negativeDiagonalCount,
    };
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
      const playerText = this.add
        .text(player.x, player.y, `Player ${playerIndex + 1}`, {
          color: player.color,
        })
        .setFontSize(15);
      playerText.playerNumber = `player${playerIndex + 1}`;

      this.playersNames.push(playerText);
      for (let i = 0; i < 16; i++) {
        const x = player.x + Math.floor(i / 8) * 32;
        const y = 50 + player.y + (i % 8) * 32;
        const block = this.add
          .sprite(x, y, `player${playerIndex + 1}`)
          .setOrigin(0, 0);
        block.name = `player${playerIndex + 1}tile${i}`;
        block.startingLocation = [x, y];
        block.description = "playersTile";
        block.depth = 1;
        block.playerAssignment = `player${playerIndex + 1}`;
        this.playerBlocks.push(block);
      }
    });
    this.addTilesToBoard(gameState.tilesPlayed);
    this.setTilesInteractive();
  }

  createTurnSprite() {
    const rectangle = this.add.graphics();
    rectangle.lineStyle(2, 0x000000);
    rectangle.strokeRect(25, 30, 92, 316);
    rectangle.startingLocation = [-4, -5];
    return rectangle;
  }

  restartTimer = () => {
    // TODO currently they can not turn timer off
    this.totalTime = this.timePerTurn;
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
      this.botMove();
    }
  };

  botMove() {
    setTimeout(() => {
      const whereToPlaceTile = this.pickRandomLocationItCanGo();
      if (whereToPlaceTile) {
        const findGridPosition = this.children.list.find((child) => {
          return (
            child.description === "board" &&
            child.x === whereToPlaceTile.x &&
            child.y === whereToPlaceTile.y
          );
        });
        let findSpriteUnmoved;
        for (let i = 0; i < 16; i++) {
          findSpriteUnmoved = this.children.list.find((child) => {
            return child.name === `player${this.setPlayer}tile${i}`;
          });
          if (
            findSpriteUnmoved.x === findSpriteUnmoved.startingLocation[0] &&
            findSpriteUnmoved.y === findSpriteUnmoved.startingLocation[1]
          ) {
            break;
          }
        }
        findSpriteUnmoved.x = whereToPlaceTile.x;
        findSpriteUnmoved.y = whereToPlaceTile.y;
        findGridPosition.player = `player${this.setPlayer}`;
        findGridPosition.played = true;
        if (this.checkWinner(findGridPosition, findSpriteUnmoved) === true) {
          this.printWinner();
        }
        socket.emit("draggedObjectPosition", findSpriteUnmoved);
      }
    }, 3000);
  }

  printWinner() {
    this.winnerText = this.add
      .text(120, 20, `Player${this.setPlayer} WINS!!!!`, {
        color: "#1e1e1e",
      })
      .setFontSize(100);
  }

  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  pickRandomLocationItCanGo() {
    const playableLocation = this.listOfAllPlayableLocations();
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
