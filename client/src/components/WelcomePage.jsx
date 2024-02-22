import GameSettings from './GameSettings.jsx';
import LinkToJoinGame from './LinkToJoinGame.jsx';
import { useState, useEffect } from 'react';
import Chat from './Chat.jsx';
import io from 'socket.io-client';
import moment from 'moment';

const WelcomePage = () => {
  const carrentDate = moment.utc().format('LLL');

  const [chatHistory, setChatHistory] = useState([
    {
      date: carrentDate,
      message: 'Welcom to OK game! Please treat other players with respect.',
    },
  ]);
  const [gameSettingsSubmitted, setGameSettingsSubmitted] = useState(false);
  const socket = io.connect('http://localhost:3001');
  useEffect(() => {
    socket.on('receive_message', (data) => {
      //console.log(data.chatMessage);
      if (data.chatMessage) {
        setChatHistory([...chatHistory, data.chatMessage]);
      }
    });
  }, [socket]); //TO DO specify which soket to send data
  console.log(chatHistory);
  return (
    <>
      <header>Ok Game</header>
      <div>Login</div>
      <GameSettings
        socket={socket}
        gameSettingsSubmitted={gameSettingsSubmitted}
        setGameSettingsSubmitted={setGameSettingsSubmitted}
      />
      <LinkToJoinGame gameSettingsSubmitted={gameSettingsSubmitted} />
      <Chat
        socket={socket}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
      />
    </>
  );
};

export default WelcomePage;
