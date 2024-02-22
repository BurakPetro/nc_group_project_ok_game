import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const ExampleInterface = ({ setgameSettings }) => {
  const socket = io.connect('http://localhost:3001');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [boardSize, setboardSize] = useState(10);
  const [massageReceived, setMessageReceived] = useState('');
  function handleUserGameSettings(event) {
    event.preventDefault();

    setgameSettings(boardSize);
    navigate('/game1');
  }
  const sendMessage = () => {
    socket.emit('send_message', { message });
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data.message);
      setMessageReceived(data.message);
    });
  }, [socket]);
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
      <div>
        <input
          placeholder="Message..."
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>
      <div>
        <h1>Message:</h1>
        {massageReceived}
      </div>
    </>
  );
};

export default ExampleInterface;
