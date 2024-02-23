import { useState } from 'react';
import moment from 'moment';
const Chat = ({ chatHistory, socket, setChatHistory }) => {
  const [message, setMessage] = useState('');
  const sendMessage = () => {
    const chatMessage = {};
    chatMessage.date = moment();
    chatMessage.message = message;
    socket.emit('send_message', { chatMessage });
    // setChatHistory([...chatHistory, data.chatMessage]);
  };

  return (
    <>
      <div className="chat-box">
        {chatHistory.map((oneMessage, index) => {
          return (
            <div key={index}>
              <div className="date-in-chat">{oneMessage.date}</div>
              <div className="message-in-chat">{oneMessage.message}</div>
            </div>
          );
        })}
      </div>
      <div>
        <input
          placeholder="Message..."
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </>
  );
};
export default Chat;
