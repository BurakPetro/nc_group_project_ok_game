import OkSvg from "../assets/ok-hand-default.svg";
import group from "../assets/group.png";
const Header = () => {
  return (
    <div className="header-block">
      <header>
        <img src={OkSvg} alt="OkSvg" />
        <span>Game</span>
      </header>

      <div className="header-buttons">
        <a href="/progect-info">
          <img src={group} alt="group of 5 people" className="global-btn" />
        </a>
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
  );
};
export default Header;
