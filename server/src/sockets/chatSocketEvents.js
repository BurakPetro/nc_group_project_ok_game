module.exports = (socket) => {
  socket.on("send_message", (data) => {
    console.log(data, "<<<chat data");
    socket.broadcast.emit("receive_message", data);
  });
};
