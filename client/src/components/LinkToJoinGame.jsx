import { useState, useEffect } from "react";
import GameSettings from "./GameSettings.jsx";

const LinkToJoinGame = () => {
  const [gameSettings, setGameSettings] = useState({
    boardSize: 17,
    numberOfPlayers: 2,
    numberOfBlocksInGame: 10,
    playerOneColor: "red",
    secondsPerTurn: 30,
    numberOfBots: 0,
    toPlayLocaly: false,
    gameSettingsSubmitted: false,
  });
  const [inputJoinLinkHolder, setInputJoinLinkHolder] = useState("");
  const [gameCreated, setGameCreated] = useState(false);
  const [waitingForGame, setwaitingForGame] = useState(false);
  const [joinLink, setJoinLink] = useState(
    "Create game and share link with other players"
  );

  let devServer = "http://localhost:3000/game";

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
    if (!gameCreated && process.env.NODE_ENV === "development") {
      setInputJoinLinkHolder("waiting for other players");
      setGameCreated(true);
      setJoinLink(
        `${devServer}?room_id=${generateRandomString()}&players=${
          gameSettings.numberOfPlayers
        }&bots=${gameSettings.numberOfBots}&playlocally=${
          gameSettings.toPlayLocaly
        }&timer=${gameSettings.secondsPerTurn}`
      );
    } else if (!gameCreated && process.env.NODE_ENV === "production") {
      devServer = "https://ok-game.onrender.com/game";
      setInputJoinLinkHolder("waiting for other players");
      setGameCreated(true);
      setJoinLink(
        `${devServer}?room_id=${generateRandomString()}&players=${
          gameSettings.numberOfPlayers
        }&bots=${gameSettings.numberOfBots}&playlocally=${
          gameSettings.toPlayLocaly
        }&timer=${gameSettings.secondsPerTurn}`
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
      window.location.assign(inputJoinLinkHolder);
    }

    setwaitingForGame(true);
  }
  function stopWaitingForGame() {
    setInputJoinLinkHolder("");
    setwaitingForGame(false);
  }
  function startGame() {
    window.location.replace(joinLink);
  }
  return (
    <>
      <div className="">
        <div className="link-block">
          <input
            className="link-input"
            value={inputJoinLinkHolder}
            placeholder="Your joining game link goes here"
            onChange={(event) => {
              setInputJoinLinkHolder(event.target.value);
            }}
            disabled={waitingForGame ? true : gameCreated ? true : false}
          />
          {waitingForGame ? (
            <button
              className="global-btn join-game-button"
              onClick={stopWaitingForGame}
            >
              Cancel
            </button>
          ) : (
            <button
              className="global-btn join-game-button"
              disabled={gameCreated}
              onClick={procesLinkToJoinGame}
            >
              Join Game
            </button>
          )}
        </div>

        <div className="link-to-join-game">
          {joinLink === "Create game and share link with other players"
            ? joinLink
            : "Share this link with other players: " + joinLink}
        </div>
        <section className="game-settings-sec">
          <GameSettings
            gameSettings={gameSettings}
            setGameSettings={setGameSettings}
          />
          <div className="link-actions">
            <button
              className="global-btn"
              onClick={generateLinkForNewGame}
              disabled={waitingForGame}
            >
              {gameCreated ? "Cancel game creation" : "Create game"}
            </button>
            <button
              disabled={!gameCreated}
              className="global-btn"
              onClick={startGame}
            >
              Start game
            </button>
          </div>
        </section>
      </div>
    </>
  );
};
export default LinkToJoinGame;
