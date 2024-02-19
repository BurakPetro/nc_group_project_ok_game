const socket = io();

export default class ExampleScene extends Phaser.Scene {
  constructor() {
    super();
    this.player;
    this.currentTilePositionX;
    this.currentTilePositionY;
  }
  preload() {
    this.load.image("bg", "assets/background.png");
    const blockImg = [
      "redtile2",
      "greentile",
      "bluetile",
      "orangetile",
      "purpletile",
    ];
    blockImg.forEach((color, index) => {
      this.load.spritesheet(`player${index + 1}`, `assets/${color}.png`, {
        frameWidth: 30,
        frameHeight: 30,
      });
    });
    //TODO currently sprite 'block6' is being using as the stationary board, May be a good idea to have tiles and board different names. Also do we need a board, we know the first player, first move is always the same, therefor we could just play there tile in the centre of board and have logic to only allow tiles to be placed around it
    this.load.spritesheet("gridblock", "assets/graytile.png", {
      frameWidth: 30,
      frameHeight: 30,
    });
    this.load.spritesheet("centreblock", "assets/centraltile.png", {
      frameWidth: 30,
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

    this.input.on("dragstart", (pointer, gameObject) => {
      this.player = gameObject.texture.key;
      this.currentTilePositionX = gameObject.x;
      this.currentTilePositionY = gameObject.y;
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      dragX = Phaser.Math.Snap.To(dragX, 32);
      dragY = Phaser.Math.Snap.To(dragY, 32);
      gameObject.setPosition(dragX, dragY);
    });

    this.input.on("dragend", (pointer, gameObject) => {
      if (!this.isValidPosition(gridArray, gameObject)) {
        gameObject.setPosition(
          this.currentTilePositionX,
          this.currentTilePositionY
        );
      } else {
        gridArray.map((gridPosition) => {
          if (
            gridPosition.x === gameObject.x &&
            gridPosition.y === gameObject.y
          ) {
            gridPosition.player = gameObject.texture.key; //update the gridArray with the player occupying the position (x,y)
          }
        });
      }
      socket.emit("draggedObjectPosition", gameObject);
    });

    socket.on("drag-end", (data) => {
      this.moveSpriteByName(data.name, data.x, data.y);

      // Handle the received message as needed
    });
    /*
    let over1 = false;
    let over2 = false;
    let over3 = false;
    let over4 = false;
    let over5 = false;
    let over6 = false;
    let over7 = false;
    let over8 = false;
    let over9 = false;

    this.input.on("dragend", (pointer, gameObject) => {
      const x = gameObject.x;
      const y = gameObject.y;
      if (x === 512 && y === 288 && !over1) {
        over1 = true;
        gameObject.setFrame(0);
        gameObject.disableInteractive();
        console.log(gameObject.texture);
        target1.body = gameObject.texture.key;
      } else if (x === 512 && y === 320 && !over2) {
        over2 = true;
        gameObject.setFrame(0);
        gameObject.disableInteractive();
        target2.body = gameObject.texture.key;
      } else if (x === 512 && y === 352 && !over3) {
        over3 = true;
        gameObject.setFrame(0);
        gameObject.disableInteractive();
        target3.body = gameObject.texture.key;
      } else if (x === 544 && y === 288 && !over4) {
        over3 = true;
        gameObject.setFrame(0);
        gameObject.disableInteractive();
        target4.body = gameObject.texture.key;
      } else if (x === 544 && y === 320 && !over5) {
        over3 = true;
        gameObject.setFrame(0);
        gameObject.disableInteractive();
        target5.body = gameObject.texture.key;
      } else if (x === 544 && y === 352 && !over6) {
        over3 = true;
        gameObject.setFrame(0);
        gameObject.disableInteractive();
        target6.body = gameObject.texture.key;
      } else if (x === 576 && y === 288 && !over7) {
        over3 = true;
        gameObject.setFrame(0);
        gameObject.disableInteractive();
        target7.body = gameObject.texture.key;
      } else if (x === 576 && y === 320 && !over8) {
        over3 = true;
        gameObject.setFrame(0);
        gameObject.disableInteractive();
        target8.body = gameObject.texture.key;
      } else if (x === 576 && y === 352 && !over9) {
        over3 = true;
        gameObject.setFrame(0);
        gameObject.disableInteractive();
        target9.body = gameObject.texture.key;
      }
      if (
        (target1.body &&
          target2.body &&
          target3.body &&
          target1.body === target2.body &&
          target2.body === target3.body) ||
        (target4.body &&
          target5.body &&
          target6.body &&
          target4.body === target5.body &&
          target5.body === target6.body) ||
        (target7.body &&
          target8.body &&
          target9.body &&
          target7.body === target8.body &&
          target8.body === target9.body) ||
        (target1.body &&
          target4.body &&
          target7.body &&
          target1.body === target4.body &&
          target4.body === target7.body) ||
        (target2.body &&
          target5.body &&
          target8.body &&
          target2.body === target5.body &&
          target5.body === target8.body) ||
        (target3.body &&
          target6.body &&
          target9.body &&
          target3.body === target6.body &&
          target6.body === target9.body) ||
        (target1.body &&
          target5.body &&
          target9.body &&
          target1.body === target5.body &&
          target5.body === target9.body) ||
        (target3.body &&
          target5.body &&
          target7.body &&
          target3.body === target5.body &&
          target5.body === target7.body)
      ) {
        let last = gameObject.texture.key.slice(
          gameObject.texture.key.length - 1,
          gameObject.texture.key.length
        );
        this.add
          .text(10, 340, `Player${last} WINS!!!!`, {
            color: "#1e1e1e",
          })
          .setFontSize(150);
        this.scene.destroy();
      }
    });*/
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

  //TODO
  isValidPosition(grid, tile) {
    for (const cell of grid) {
      if (tile.x === cell.x && tile.y === cell.y) {
        if (cell.player === null) {
          tile.input.draggable = false;
          return true;
        }
        break;
      }
    }

    return false;
  }
}
