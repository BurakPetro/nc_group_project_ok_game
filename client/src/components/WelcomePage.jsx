import GameSettings from './GameSettings.jsx';
import LinkToJoinGame from './LinkToJoinGame.jsx';
import { useState } from 'react';
const WelcomePage = () => {
  const [gameSettingsSubmitted, setGameSettingsSubmitted] = useState(false);
  return (
    <>
      <header>Ok Game</header>
      <div>Login</div>
      <GameSettings
        gameSettingsSubmitted={gameSettingsSubmitted}
        setGameSettingsSubmitted={setGameSettingsSubmitted}
      />
      <LinkToJoinGame gameSettingsSubmitted={gameSettingsSubmitted} />
      <div>Chat Box</div>
    </>
  );
};

export default WelcomePage;
