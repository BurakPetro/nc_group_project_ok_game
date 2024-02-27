const socketIO = require("socket.io");
const gameSocketEvents = require("./gameSocketEvents");
const chatSocketEvents = require("./chatSocketEvents");

// Petro - CORS block interactions between client frontend and server back end, "*" mean alow all and will be considered as security fail, later need to specify and remove "*"
function configureSockets(server) {
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`A user connected ${socket.id} to server`);

    gameSocketEvents(socket, io);
    chatSocketEvents(socket);

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}

module.exports = { configureSockets };
