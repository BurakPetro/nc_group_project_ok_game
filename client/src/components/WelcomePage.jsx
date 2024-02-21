import GameSettings from './GameSettings.jsx';
import LinkToJoinGame from './LinkToJoinGame.jsx';

const WelcomePage = () => {
  return (
    <>
      <header>Ok Game</header>
      <div>Login</div>
      <GameSettings />
      <LinkToJoinGame />
      <div>Chat Box</div>
    </>
  );
};

export default WelcomePage;
