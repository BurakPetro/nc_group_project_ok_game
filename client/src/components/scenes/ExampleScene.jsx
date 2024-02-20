//import Phaser from 'phaser';
const sceneWrap = (gameSettings) => {
  let a = gameSettings;

  return class ExampleScene extends Phaser.Scene {
    constructor() {
      super();
    }

    preload() {
      this.load.image('bg', 'assets/background.png');
      const blockImg = [
        'redtile2',
        'greentile',
        'bluetile',
        'orangetile',
        'purpletile',
      ];
      blockImg.forEach((color, index) => {
        this.load.spritesheet(`player${index + 1}`, `assets/${color}.png`, {
          frameWidth: 30,
          frameHeight: 30,
        });
      });
      //TODO currently sprite 'block6' is being using as the stationary board, May be a good idea to have tiles and board different names. Also do we need a board, we know the first player, first move is always the same, therefor we could just play there tile in the centre of board and have logic to only allow tiles to be placed around it
      this.load.spritesheet('gridblock', 'assets/graytile.png', {
        frameWidth: 30,
        frameHeight: 30,
      });
      this.load.spritesheet('centreblock', 'assets/centraltile.png', {
        frameWidth: 30,
        frameHeight: 30,
      });
    }
    create() {
      this.add.image(600, 412, 'bg');

      //  grid

      const size = /*gameSettings.boardSize*/ a;

      //here we imput the size we want for the grid and it will build a grid perfectly centered
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
          const gridPosition = this.add
            .sprite(x, y, `gridblock`)
            .setOrigin(0, 0);
          gridPosition.name = `grid${i}`;
          gridArray.push({ name: gridPosition.name, x: x, y: y, player: null });
        }
      }

      const playerData = [
        { x: 32, y: 32, color: '#1e1e1e' },
        { x: 1088, y: 32, color: '#1e1e1e' },
        { x: 1088, y: 480, color: '#1e1e1e' },
        { x: 32, y: 480, color: '#1e1e1e' },
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

      this.input.on('dragstart', (pointer, gameObject) => {});

      this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        dragX = Phaser.Math.Snap.To(dragX, 32);
        dragY = Phaser.Math.Snap.To(dragY, 32);
        gameObject.setPosition(dragX, dragY);
      });

      this.input.on('dragend', (pointer, gameObject) => {
        gridArray.map((gridPosition) => {
          if (
            gridPosition.x === gameObject.x &&
            gridPosition.y === gameObject.y
          ) {
            gridPosition.player = gameObject.texture.key; //update the gridArray with the player occupying the position (x,y)
          }
        });
        //socket.emit('draggedObjectPosition', gameObject);
      });
    }
  };
};
export default sceneWrap;
