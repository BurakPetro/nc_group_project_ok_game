import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const ExampleInterface = ({ setgameSettings }) => {
  const navigate = useNavigate();
  const [boardSize, setboardSize] = useState(10);
  function handleUserGameSettings(event) {
    event.preventDefault();
    /* if (boardSize < 10) {
      setgameSettings(10);
    } else if (boardSize > 25) {
      setgameSettings(25);
    } else {
      setgameSettings(boardSize);
    }*/
    setgameSettings(boardSize);
    navigate('/game1');
  }
  return (
    <>
      <form onSubmit={handleUserGameSettings}>
        <label htmlFor="user-comment">
          Specify your board numbers between 10-25
        </label>
        <input
          type="number"
          id="user-game-board-size"
          value={boardSize}
          onChange={(event) => {
            setboardSize(event.target.value);
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default ExampleInterface;
