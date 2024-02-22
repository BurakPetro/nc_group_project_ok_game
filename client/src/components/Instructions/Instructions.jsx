import "./Instructions.css";

const Instructions = () => {
  return (
    <>
      <button
        id="back-button"
        type="button"
        onClick={() => {
          window.location.href = '/Welcome'}}
      >
        Back
      </button>
      <section>
        <article>
          <h2>How to play OK Play</h2>
          <p>
            Your mission is to get five tiles in a row either vertically or
            horizontally.
          </p>
          <p>You can play the game with two players and up to four players.</p>
          <p>The first player plays their tile in the middle.</p>
          <p>
            The next player can <b>only</b> lay their tile on any flat edge of
            the middle tile.
          </p>
          <p>
            This continues like this with players trying to win the game with
            five tiles in a row.
          </p>
          <p>
            One last tip! Sometimes you may have to work together with others to
            stop others from stealing a sneaky win!
          </p>
        </article>
      </section>
    </>
  );
};

export default Instructions;
