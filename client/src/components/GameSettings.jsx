import io from 'socket.io-client';
import Select from './Select.jsx';
import { useState, useEffect } from 'react';

const GameSettings = ({ gameSettings, setGameSettings, socket }) => {
  //const [serverResponse, setServerResponce] = useState(null); // to proces server responce in future
  /* useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data.message);
      setServerResponce(data.message);
    });
  }, [socket]); //TO DO specify which soket to send data*/

  /*const sendData = (data) => {
    socket.emit('send_message', { data });
  };*/
  function handleUserGameSettingsSubmit(event) {
    if (gameSettings.gameSettingsSubmitted) {
      event.preventDefault();
      setGameSettings({
        ...gameSettings,
        gameSettingsSubmitted: false,
      });
    } else {
      event.preventDefault();
      console.log(gameSettings);
      setGameSettings({
        ...gameSettings,
        gameSettingsSubmitted: true,
      });
    }
  }

  return (
    <>
      <h1>Chose your settings to create a new game</h1>
      <form onSubmit={handleUserGameSettingsSubmit}>
        <Select
          label="Choose number of players?"
          options={[
            { label: 'two players', value: 2 },
            { label: 'three players', value: 3 },
            { label: 'four players', value: 4 },
          ]}
          value={gameSettings.numberOfPlayers}
          disabled={gameSettings.gameSettingsSubmitted}
          onChange={(event) => {
            setGameSettings({
              ...gameSettings,
              numberOfPlayers: event.target.value,
            });
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
          value={gameSettings.boardSize}
          disabled={gameSettings.gameSettingsSubmitted}
          onChange={(event) => {
            setGameSettings({
              ...gameSettings,
              boardSize: event.target.value,
            });
          }}
        />
        <Select
          label="Chose number of blocks avaliable for player"
          options={[
            { label: '10', value: 10 },
            { label: '15', value: 15 },
            { label: '20', value: 20 },
          ]}
          value={gameSettings.numberOfBlocksInGame}
          disabled={gameSettings.gameSettingsSubmitted}
          onChange={(event) => {
            setGameSettings({
              ...gameSettings,
              numberOfBlocksInGame: event.target.value,
            });
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
          value={gameSettings.playerOneColor}
          disabled={gameSettings.gameSettingsSubmitted}
          onChange={(event) => {
            setGameSettings({
              ...gameSettings,
              playerOneColor: event.target.value,
            });
          }}
        />

        <button type="submit">
          {!gameSettings.gameSettingsSubmitted ? 'Submit' : 'Change Settings'}
        </button>
      </form>
    </>
  );
};

export default GameSettings;
