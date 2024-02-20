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
  }
  preload() {
    this.load.image("bg", "assets/background.png");
    const blockImg = ["redtile2", "greentile", "bluetile", "purpletile"];
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
      frameWidth: 80,
      frameHeight: 30,
    });
  }

  create() {
    this.add.image(600, 412, "bg");

    //  grid

    const size = 17; //here we imput the size we want for the grid and it will build a grid perfectly centered
    const totalTiles = size * size;
    const gridArray = []; //one object for each position in the grid with its name, x and y positions and the player occupying that position, default to null
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
        gridArray.push({ name: gridPosition.name, x: x, y: y, player: null });
      } else {
        const gridPosition = this.add.sprite(x, y, `gridblock`).setOrigin(0, 0);
        gridPosition.name = `grid${i}`;
        gridArray.push({ name: gridPosition.name, x: x, y: y, player: null });
      }
    }

    fetchGameSetup((gameState) => {
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
    });

    let setPlayer = 1;

    this.input.on("dragstart", (pointer, gameObject) => {
      gameObject.setTint(0x868e96); //change the colour of the tile when dragging
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      dragX = Phaser.Math.Snap.To(dragX, 32);
      dragY = Phaser.Math.Snap.To(dragY, 32);
      gameObject.setPosition(dragX, dragY);
    });

    this.input.on("dragend", (pointer, gameObject, dropped) => {
      gameObject.setTint(); //change the colour back

      if (!dropped) {
        //if the object is dropped outside the grid it goes back to its original position in the deck
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      } else {
        if (gameObject.texture.key === `player${setPlayer}`) {
          //check if player is using its own tiles
          gridArray.map((gridPosition) => {
            //check if the position is accepted (Ahmed code)
            if (
              gridPosition.x === gameObject.x &&
              gridPosition.y === gameObject.y
            ) {
              gridPosition.player = gameObject.texture.key; //update the gridArray with the player occupying the position (x,y)
              gameObject.disableInteractive();
              if (setPlayer === 4) {
                setPlayer = 1;
              } else {
                setPlayer++;
              }
            }
          });
        } else {
          gameObject.x = gameObject.input.dragStartX;
          gameObject.y = gameObject.input.dragStartY;
        }
      }
      socket.emit("draggedObjectPosition", gameObject);
    });

    socket.on("drag-end", (data) => {
      this.moveSpriteByName(data.name, data.x, data.y);
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

    if (spriteToMove) {
      spriteToMove.setPosition(newX, newY);
    } else {
      console.log(`Sprite with name ${spriteName} not found`);
    }
  }

  /**
   * addTilesToBoard move the tiles in the array
   * @date 20/02/2024 - 20:46:55
   *
   * @param {Array} tilesToAdd
   */
  addTilesToBoard(tilesToAdd) {
    tilesToAdd.forEach((value) => {
      this.moveSpriteByName(value.name, value.x, value.y);
    });
  }
}
