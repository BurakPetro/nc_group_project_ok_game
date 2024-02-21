import { useState } from 'react';
import ExampleInterface from './components/ExampleInterface';
import Game from './components/Game';
import WelcomePage from './components/WelcomePage';
import { Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  const [gameSettings, setgameSettings] = useState(17);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<ExampleInterface setgameSettings={setgameSettings} />}
        />

        <Route path="/Welcome" element={<WelcomePage />} />
        <Route path="/game1" element={<Game gameSettings={gameSettings} />} />
      </Routes>
    </>
  );
}

export default App;
