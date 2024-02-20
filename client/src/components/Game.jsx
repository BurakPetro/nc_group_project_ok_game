import React, { useEffect } from 'react';
import Phaser from 'phaser';
import sceneWrap from './scenes/ExampleScene.jsx';

function Game({ gameSettings, setgameSettings }) {
  let game = null;
  console.log(gameSettings);
  const config = {
    type: Phaser.AUTO,
    width: 1184,
    height: 800,
    parent: 'phaser-example',

    scene: sceneWrap(gameSettings, setgameSettings),
    physics: {
      default: 'arcade',
      arcade: {},
    },
  };
  useEffect(() => {
    if (!game) {
      game = new Phaser.Game(config);
    }
  }, []);

  return <div id="phaser-game" />;
}

export default Game;
