import GameSettings from "./GameSettings.jsx";

const WelcomePage = () => {
  return (
    <>
      <header>Ok Game</header>
      <div>Login</div>
      <button
        onClick={() => {
          window.location.href = "/instructions";
        }}
        style={{
          display: "flex",
          position: "absolute",
          top: "0%",
          right: "0%",
          marginTop: "1%",
          marginRight: "1%",
        }}
        onMouseOver='test'
      >
        ?
      </button>
      <GameSettings />

      <div>Chat Box</div>
    </>
  );
};

export default WelcomePage;
