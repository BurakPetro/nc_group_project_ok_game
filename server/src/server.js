const { app, server } = require("./app");
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === "production") {
  server.listen(port, () => {
    console.log('Game -->', "https://ok-game.onrender.com/game");
  });
} else {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
