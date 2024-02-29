import reactLogo from "../assets/react.svg";
import vitelLogo from "../assets/vite.svg";
import javascriptLogo from "../assets/javascript.png";
import phaserLogo from "../assets/phaser.png";
import "../styles/ProjectInfo.css";
import socketIoLogo from "../assets/socketio.png";
import NorthcodersLogo from "../assets/northcoders.jpg";
const ProjectInfo = () => {
  return (
    <>
      <div className="main">
        <div>
          <h2>Our team</h2>
          <li>
            <a target="_blank" href="https://github.com/ahmedsatti101">
              Ahmed Mohamed
            </a>
          </li>
          <li>
            <a target="_blank" href="https://github.com/deankiwi">
              Dean Welch
            </a>
          </li>
          <li>
            <a target="_blank" href="https://github.com/mohsinahmxd">
              Mohsin Ahmed
            </a>
          </li>
          <li>
            <a target="_blank" href="https://github.com/BurakPetro">
              Petro Burak
            </a>
          </li>
          <li>
            <a target="_blank" href="https://github.com/rsr83">
              Rafael Ramalho
            </a>
          </li>
        </div>
        <div className="tech-stack">
          <h2>Our tech stuck</h2>
          <a target="_blank" href="https://react.dev/">
            <img src={reactLogo} alt="react logo" className="react-logo" />
          </a>
          <a target="_blank" href="https://vitejs.dev/">
            <img src={vitelLogo} alt="vite logo" className="vite-logo" />
          </a>

          <a target="_blank" href="https://www.javascript.com/">
            <img
              src={javascriptLogo}
              alt="javascript logo"
              className="javascript-logo"
            />
          </a>
          <a target="_blank" href="https://phaser.io/">
            <img src={phaserLogo} alt="phaser logo" className="phaser-logo" />
          </a>

          <a target="_blank" href="https://socket.io/">
            <img
              src={socketIoLogo}
              alt="socket.io logo"
              className="socketIo-logo"
            />
          </a>
        </div>
        <div>
          <span>
            {" "}
            <a target="_blank" href="https://northcoders.com/">
              <img
                src={NorthcodersLogo}
                alt="northcoders logo"
                className="northcoders-logo"
              />
            </a>
            This progect was done as part of Coding Bootcamp.
          </span>
        </div>
      </div>
    </>
  );
};

export default ProjectInfo;
