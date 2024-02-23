import GameSettings from './GameSettings.jsx';
import LinkToJoinGame from './LinkToJoinGame.jsx';
import { useState, useEffect } from 'react';
import Chat from './Chat.jsx';
import io from 'socket.io-client';
import moment from 'moment';

const WelcomePage = () => {
  const carrentDate = moment.utc().format('LLL');
  const [gameSettings, setGameSettings] = useState({
    boardSize: 17,
    numberOfPlayers: 2,
    numberOfBlocksInGame: 10,
    playerOneColor: 'red',
    gameSettingsSubmitted: false,
  });

  const [chatHistory, setChatHistory] = useState([
    {
      date: carrentDate,
      message: 'Welcom to OK game! Please treat other players with respect.',
    },
  ]);

  const socket = io.connect('http://localhost:3000');
  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data.chatMessage);
      if (data.chatMessage) {
        setChatHistory([...chatHistory, data.chatMessage]);
      }
    });
  }, [socket]);

  return (
    <>
      <header>Ok Game</header>
      <div>Login</div>
      <button
        onClick={() => {
          window.location.href = '/instructions';
        }}
        style={{
          display: 'flex',
          position: 'absolute',
          top: '0%',
          right: '0%',
          marginTop: '1%',
          marginRight: '1%',
          border: '1px solid white',
        }}
      >
        ?
      </button>
      <GameSettings
        socket={socket}
        gameSettings={gameSettings}
        setGameSettings={setGameSettings}
      />
      <LinkToJoinGame gameSettings={gameSettings} />
      <Chat
        socket={socket}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
      />
    </>
  );
};

export default WelcomePage;
