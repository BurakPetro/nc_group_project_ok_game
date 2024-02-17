import ExampleScene from "./scenes/ExampleScene.js";

const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 824,
  parent: "phaser-example",
  scene: ExampleScene,
  physics: {
    default: "arcade",
    arcade: {},
  },
};

const game = new Phaser.Game(config);
