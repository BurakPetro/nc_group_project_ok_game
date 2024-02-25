import { useState, useEffect } from "react";
const LinkToJoinGame = ({ gameSettings }) => {
  const [inputJoinLinkHolder, setInputJoinLinkHolder] = useState("");
  const [gameCreated, setGameCreated] = useState(false);
  const [waitingForGame, setwaitingForGame] = useState(false);
  const [joinLink, setJoinLink] = useState(
    "Create game and share link with other players"
  );
  function generateRandomString() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let randomString = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      randomString += alphabet.charAt(randomIndex);
    }

    return randomString;
  }
  function generateLinkForNewGame() {
    // TO DO create function to take link from serve and dislpay for user
    if (!gameCreated) {
      setInputJoinLinkHolder("waiting for other players");
      setGameCreated(true);
      setJoinLink(
        `http://localhost:3000/game?room_id=${generateRandomString()}&players=${
          gameSettings.numberOfPlayers
        }`
      );
    } else {
      setGameCreated(false);
      setJoinLink("Create game and share link with other players");
      setInputJoinLinkHolder("Your joining game link here");
    }
  }
  function procesLinkToJoinGame() {
    // TO DO create function to take link and connect to game
    if (inputJoinLinkHolder[0] === "h" && inputJoinLinkHolder[1] === "t") {
      window.location.replace(inputJoinLinkHolder);
    }

    setwaitingForGame(true);
    console.log(inputJoinLinkHolder);
  }
  function stopWaitingForGame() {
    setInputJoinLinkHolder("");
    setwaitingForGame(false);
  }
  function shortCutToSeeGame() {
    window.location.replace(joinLink);
  }
  return (
    <>
      <div className="link-block">
        <input
          value={inputJoinLinkHolder}
          placeholder="Your joining game link goes here"
          onChange={(event) => {
            setInputJoinLinkHolder(event.target.value);
          }}
          disabled={waitingForGame ? true : gameCreated ? true : false}
        />
        {waitingForGame ? (
          <button onClick={stopWaitingForGame}>Cancel</button>
        ) : (
          <button disabled={gameCreated} onClick={procesLinkToJoinGame}>
            Join Game
          </button>
        )}

        <div className="link-to-join-game">
          {joinLink === "Create game and share link with other players"
            ? joinLink
            : "Share this link with other players " + joinLink}
        </div>

        <button
          className="create-game-button"
          onClick={generateLinkForNewGame}
          disabled={
            waitingForGame
              ? true
              : gameSettings.gameSettingsSubmitted
              ? false
              : true
          }
        >
          {gameCreated ? "Cancel game creation" : "Create game"}
        </button>
        <button onClick={shortCutToSeeGame}>TemButton</button>
      </div>
    </>
  );
};
export default LinkToJoinGame;
