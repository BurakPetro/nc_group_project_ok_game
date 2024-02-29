import LinkToJoinGame from "./LinkToJoinGame.jsx";
import React, { useState, useEffect } from "react";
import Chat from "./Chat.jsx";
import io from "socket.io-client";
import moment from "moment";
import "../styles/WelcomePage.css";

import Header from "./Header.jsx";

const WelcomePage = () => {
  const carrentDate = moment.utc().format("LLL");

  const [chatHistory, setChatHistory] = useState([
    {
      date: carrentDate,
      message: "Welcome to OK play! Please treat other players with respect.",
    },
  ]);

  let socket;
  if (process.env.NODE_ENV === "development") {
    socket = io.connect("http://localhost:3000");
  } else {
    socket = io.connect("https://ok-game.onrender.com");
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data.chatMessage);
      if (data.chatMessage) {
        setChatHistory([...chatHistory, data.chatMessage]);
      }
    });
  });

  return (
    <div className="main-block">
      <Header />
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
