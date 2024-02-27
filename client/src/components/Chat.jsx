import { useState } from "react";
import moment from "moment";
const Chat = ({ chatHistory, socket, setChatHistory }) => {
  const [message, setMessage] = useState("");
  const sendMessage = () => {
    const chatMessage = {};
    chatMessage.date = moment();
    chatMessage.message = message;
    socket.emit("send_message", { chatMessage });
    // setChatHistory([...chatHistory, data.chatMessage]);
  };

  return (
    <>
      <div className="chat-box">
        {chatHistory.map((oneMessage, index) => {
          return (
            <div key={index} className="chat-history">
              <div className="date-in-chat">
                {moment(oneMessage.date).format("LLL")}
              </div>
              <div className="message-in-chat">{oneMessage.message}</div>
            </div>
          );
        })}
        <div className="send-message-block">
          <input
            className="message-input"
            placeholder="Message..."
            onChange={(event) => {
              setMessage(event.target.value);
            }}
          />
          <button
            className="global-btn send-message-button"
            onClick={sendMessage}
          >
            Send Message
          </button>
        </div>
      </div>
    </>
  );
};
export default Chat;
