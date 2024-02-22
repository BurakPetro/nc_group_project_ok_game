import ExampleScene from "./scenes/ExampleScene.js";

const config = {
  type: Phaser.AUTO,
  width: 1184,
  height: 800,
  parent: "phaser-example",
  scene: ExampleScene,
  physics: {
    default: "arcade",
    arcade: {},
    debug: true,
  },
};

const game = new Phaser.Game(config);
