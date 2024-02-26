import LinkToJoinGame from "./LinkToJoinGame.jsx";
import React, { useState, useEffect } from "react";
import Chat from "./Chat.jsx";
import io from "socket.io-client";
import moment from "moment";
import "../styles/WelcomePage.css";
import OkSvg from "../assets/ok-hand-default.svg";

const WelcomePage = () => {
  const carrentDate = moment.utc().format("LLL");

  const [chatHistory, setChatHistory] = useState([
    {
      date: carrentDate,
      message: "Welcom to OK game! Please treat other players with respect.",
    },
  ]);

  const socket = io.connect("https://ok-game.onrender.com/game");
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data.chatMessage);
      if (data.chatMessage) {
        setChatHistory([...chatHistory, data.chatMessage]);
      }
    });
  }, [socket]);

  return (
    <div className="main-block">
      <div className="header-block">
        <header>
          <img src={OkSvg} alt="OkSvg" />
          <span>Game</span>
        </header>
        <div className="header-buttons">
          <button className="global-btn btn-purple">Login</button>
          <button
            className="global-btn btn-purple"
            onClick={() => {
              window.location.href = "/instructions";
            }}
          >
            ?
          </button>
        </div>
      </div>
      <div className="settings-block">
        <h1>Create your own room or join via link</h1>
        <LinkToJoinGame />
      </div>
      <Chat
        socket={socket}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
      />
    </div>
  );
};

export default WelcomePage;
