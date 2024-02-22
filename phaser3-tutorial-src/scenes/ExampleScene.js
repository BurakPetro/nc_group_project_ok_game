const socket = io();

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

    const playerData = [
      { x: 32, y: 32, color: "#1e1e1e" },
      { x: 1088, y: 32, color: "#1e1e1e" },
      { x: 1088, y: 480, color: "#1e1e1e" },
      { x: 32, y: 480, color: "#1e1e1e" },
    ];

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
        //check if player is using its own tiles
      } else {
        if (gameObject.texture.key === `player${setPlayer}`) {
          gridArray.map((gridPosition) => {
            //check if the position is accepted (Ahmed code)
            if (
              gridPosition.x === gameObject.x &&
              gridPosition.y === gameObject.y
            ) {
              // check for 5 in a row
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
                    gridArray[(currCheck -= 1)].player ===
                      gameObject.texture.key
                  ) {
                    verticalCount++;
                  }
                }
                // check below
                if (i >= 4 && i < 8) {
                  if (
                    currCheck + 1 <= 288 &&
                    gridArray[(currCheck += 1)].player ===
                      gameObject.texture.key
                  ) {
                    verticalCount++;
                  }
                }
                // check to the right
                if (i >= 8 && i < 12) {
                  if (
                    currCheck + 17 <= 288 &&
                    gridArray[(currCheck += 17)].player ===
                      gameObject.texture.key
                  ) {
                    horizontalCount++;
                  }
                }
                // check to the left
                if (i >= 12 && i < 16) {
                  if (
                    currCheck - 17 >= 0 &&
                    gridArray[(currCheck -= 17)].player ===
                      gameObject.texture.key
                  ) {
                    horizontalCount++;
                  }
                }
                // check top right
                if (i >= 16 && i < 20) {
                  if (
                    currCheck + 17 - 1 >= 0 &&
                    currCheck + 17 - 1 <= 288 &&
                    gridArray[(currCheck += 17 - 1)].player ===
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
                    gridArray[(currCheck = currCheck - 16)].player ===
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
                    gridArray[(currCheck -= 18)].player ===
                      gameObject.texture.key
                  ) {
                    negativeDiagonalCount++;
                  }
                }
                // check bottom right
                if (i >= 28) {
                  if (
                    currCheck + 18 <= 288 &&
                    gridArray[(currCheck += 18)].player ===
                      gameObject.texture.key
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
                console.log(`${gameObject.texture.key} wins!`);
              }

              //update the gridArray with the player occupying the position (x,y)
              gridPosition.player = gameObject.texture.key;
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
}
