import Select from "./Select.jsx";

const GameSettings = ({ gameSettings, setGameSettings }) => {
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
      <h2>Chose your settings to create a new game</h2>
      <form onSubmit={handleUserGameSettingsSubmit} className="settings-form">
        <div className="setting-line">
          <Select
            label="Number of players:"
            options={[
              { label: "two players", value: 2 },
              { label: "three players", value: 3 },
              { label: "four players", value: 4 },
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
            label="Board size:"
            options={[
              { label: "10X10", value: 10 },
              { label: "15X15", value: 15 },
              { label: "17X17", value: 17 },
              { label: "20X20", value: 20 },
              { label: "25X25", value: 25 },
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
        </div>

        <div className="setting-line">
          <Select
            label="Number of blocks avaliable for player:"
            options={[
              { label: "10", value: 10 },
              { label: "15", value: 15 },
              { label: "20", value: 20 },
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
            label="Your color:"
            options={[
              { label: "red", value: "red" },
              { label: "blue", value: "blue" },
              { label: "orange", value: "orange" },
              { label: "green", value: "green" },
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
        </div>

        <button type="submit" className="global-btn btn-purple">
          {!gameSettings.gameSettingsSubmitted
            ? "Submit settings"
            : "Change settings"}
        </button>
      </form>
    </>
  );
};

export default GameSettings;
