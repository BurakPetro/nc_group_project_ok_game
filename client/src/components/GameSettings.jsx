import io from 'socket.io-client';
import Select from './Select.jsx';
import { useState, useEffect } from 'react';
import LinkToJoinGame from './LinkToJoinGame.jsx';

const GameSettings = () => {
  const socket = io.connect('http://localhost:3001');
  const [boardSize, setboardSize] = useState(17);
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [numberOfBlocksInGame, setnumberOfBlocksInGame] = useState(10);
  const [playerOneColor, setPlayerOneColor] = useState('red');

  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data.message);
      setMessageReceived(data.message);
    });
  }, [socket]); //TO DO specify which soket to send data

  const sendData = (data) => {
    socket.emit('send_message', { data });
  };
  function handleUserGameSettingsSubmit(event) {
    event.preventDefault();
    const gameSettings = {};
    gameSettings.boardSize = boardSize;
    gameSettings.numberOfPlayers = numberOfPlayers;
    gameSettings.numberOfBlocksInGame = numberOfBlocksInGame;
    gameSettings.playerOneColor = playerOneColor;
    sendData(gameSettings);
  }

  return (
    <>
      <form onSubmit={handleUserGameSettingsSubmit}>
        <Select
          label="Choose number of players?"
          options={[
            { label: 'two players', value: 2 },
            { label: 'three players', value: 3 },
            { label: 'four players', value: 4 },
          ]}
          value={numberOfPlayers}
          onChange={(event) => {
            setNumberOfPlayers(event.target.value);
          }}
        />
        <Select
          label="Chose board size"
          options={[
            { label: '10X10', value: 10 },
            { label: '15X15', value: 15 },
            { label: '17X17', value: 17 },
            { label: '20X20', value: 20 },
            { label: '25X25', value: 25 },
          ]}
          value={boardSize}
          onChange={(event) => {
            setboardSize(event.target.value);
          }}
        />
        <Select
          label="Chose number of blocks avaliable for player"
          options={[
            { label: '10', value: 10 },
            { label: '15', value: 15 },
            { label: '20', value: 20 },
          ]}
          value={numberOfBlocksInGame}
          onChange={(event) => {
            setnumberOfBlocksInGame(event.target.value);
          }}
        />
        <Select
          label="Chose your color"
          options={[
            { label: 'red', value: 'red' },
            { label: 'blue', value: 'blue' },
            { label: 'orange', value: 'orange' },
            { label: 'green', value: 'green' },
          ]}
          value={playerOneColor}
          onChange={(event) => {
            setPlayerOneColor(event.target.value);
          }}
        />

        <button type="submit">Submit</button>
      </form>
      <LinkToJoinGame />
    </>
  );
};

export default GameSettings;
