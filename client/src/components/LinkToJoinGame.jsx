import { useState } from 'react';
const LinkToJoinGame = () => {
  const [inputJoinLinkHolder, setInputJoinLinkHolder] = useState(
    'Your joining game link here'
  );
  const [waitingForGame, setwaitingForGame] = useState(false);
  const [joinLink, setJoinLink] = useState(
    'Create game and share link with other players'
  );
  function generateLinkForNewGame() {
    // TO DO create function to take link from serve and dislpay for user
    setJoinLink('http://localhost:3001/');
  }
  function procesLinkToJoinGame() {
    // TO DO create function to take link and connect to game
    setInputJoinLinkHolder('waiting for other players');
    setwaitingForGame(true);
  }
  function stopWaitingForGame() {
    setInputJoinLinkHolder('Your joining game link here');
    setwaitingForGame(false);
  }
  return (
    <>
      <div className="link-block">
        <input
          value={inputJoinLinkHolder}
          onChange={(event) => {
            setInputJoinLinkHolder(event.target.value);
          }}
        />
        {waitingForGame ? (
          <button onClick={stopWaitingForGame}>Cansel</button>
        ) : (
          <button onClick={procesLinkToJoinGame}>Join Game</button>
        )}

        <div className="link-to-join-game">{joinLink}</div>

        <button onClick={generateLinkForNewGame}>Create game</button>
      </div>
    </>
  );
};
export default LinkToJoinGame;
