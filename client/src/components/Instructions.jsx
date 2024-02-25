import "../styles/Instructions.css";

const Instructions = () => {
  return (
    <>
      <div className="main-instructions">
        <button
          className="global-btn"
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Back
        </button>
        <section className="instuctions">
          <article>
            <h2>How to play OK Play</h2>
            <ul>
              <li>
                Your mission is to get five tiles in a row either vertically or
                horizontally.
              </li>
              <li>
                You can play the game with two players and up to four players.
              </li>
              <li>The first player plays their tile in the middle.</li>
              <li>
                The next player can <b>only</b> lay their tile on any flat edge
                of the middle tile.
              </li>
              <li>
                This continues like this with players trying to win the game
                with five tiles in a row.
              </li>
              <li>
                Sometimes you may have to work together with others to stop
                others from stealing a sneaky win!
              </li>
            </ul>
          </article>
        </section>
      </div>
    </>
  );
};

export default Instructions;
